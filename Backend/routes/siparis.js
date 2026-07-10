const yetkiKontrol = require('../middleware/yetkiKontrol');
const express = require('express');
const router = express.Router();
const Siparis = require('../models/Siparis');
const Kargo = require('../models/Kargo');
const Eczane = require('../models/Eczane');
const Ilac = require('../models/Ilac');
const auth = require('../middleware/auth');

// SİPARİŞLERİ LİSTELE
// personel: hepsini görür / eczane: sadece kendi siparişlerini görür
router.get('/', auth, async (req, res) => {
  try {
    const filtre = {};
    if (req.user.role === 'eczane') {
      if (!req.user.eczane) {
        return res.json([]);
      }
      filtre.eczane = req.user.eczane;
    }

    const siparisler = await Siparis.find(filtre)
      .populate('eczane')
      .populate('urunler.ilac')
      .populate('kargo')
      .sort({ createdAt: -1 });
    res.json(siparisler);
  } catch (err) {
    res.status(500).json({ mesaj: 'Sunucu hatası', hata: err.message });
  }
});

// YENİ SİPARİŞ OLUŞTUR
// personel: istediği eczane adına sipariş açabilir / eczane: sadece kendi adına
router.post('/', auth, async (req, res) => {
  try {
    const { urunler } = req.body;
    let { eczane } = req.body;

    if (req.user.role === 'eczane') {
      if (!req.user.eczane) {
        return res.status(400).json({ mesaj: 'Hesabınıza bağlı bir eczane kaydı bulunamadı' });
      }
      eczane = req.user.eczane; // kullanıcının gönderdiği değeri yok say, kendi eczanesini zorla
    }

    const yeniSiparis = new Siparis({ eczane, urunler });
    await yeniSiparis.save();
    res.status(201).json({ mesaj: 'Sipariş oluşturuldu', siparis: yeniSiparis });
  } catch (err) {
    res.status(500).json({ mesaj: 'Sunucu hatası', hata: err.message });
  }
});

// SİPARİŞİ ONAYLA VE SEVKİYAT OLUŞTUR
router.put('/:id/onayla', auth, yetkiKontrol('personel'), async (req, res) => {
  try {
    const siparis = await Siparis.findById(req.params.id).populate('eczane').populate('urunler.ilac');
    if (!siparis) {
      return res.status(404).json({ mesaj: 'Sipariş bulunamadı' });
    }

    // Stok kontrolü - yeterli stok var mı?
    for (const kalem of siparis.urunler) {
      if (kalem.ilac.stokMiktari < kalem.miktar) {
        return res.status(400).json({
          mesaj: `${kalem.ilac.ilacAdi} için yeterli stok yok (mevcut: ${kalem.ilac.stokMiktari}, istenen: ${kalem.miktar})`
        });
      }
    }

    // Stokları düş
    for (const kalem of siparis.urunler) {
      await Ilac.findByIdAndUpdate(kalem.ilac._id, { $inc: { stokMiktari: -kalem.miktar } });
    }

    const yeniKargo = new Kargo({
      takipNo: 'DEPO-' + Date.now(),
      gonderen: 'Ecza Deposu',
      alici: siparis.eczane.eczaneAdi,
      adres: siparis.eczane.adres,
      durum: 'Hazırlanıyor',
    });
    await yeniKargo.save();

    siparis.kargo = yeniKargo._id;
    siparis.durum = 'Sevk Edildi';
    await siparis.save();

    res.json({ mesaj: 'Sipariş onaylandı ve sevkiyat oluşturuldu', siparis, kargo: yeniKargo });
  } catch (err) {
    res.status(500).json({ mesaj: 'Sunucu hatası', hata: err.message });
  }
});

module.exports = router;