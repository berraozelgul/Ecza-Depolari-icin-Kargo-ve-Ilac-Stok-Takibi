const yetkiKontrol = require('../middleware/yetkiKontrol');
const express = require('express');
const router = express.Router();
const Siparis = require('../models/Siparis');
const Kargo = require('../models/Kargo');
const Eczane = require('../models/Eczane');
const Ilac = require('../models/Ilac');
const auth = require('../middleware/auth');

// SİPARİŞLERİ LİSTELE
router.get('/', auth, async (req, res) => {
  try {
    const siparisler = await Siparis.find()
      .populate('eczane')
      .populate('urunler.ilac')
      .sort({ createdAt: -1 });
    res.json(siparisler);
  } catch (err) {
    res.status(500).json({ mesaj: 'Sunucu hatası', hata: err.message });
  }
});

// YENİ SİPARİŞ OLUŞTUR
router.post('/', auth, async (req, res) => {
  try {
    const { eczane, urunler } = req.body;
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
