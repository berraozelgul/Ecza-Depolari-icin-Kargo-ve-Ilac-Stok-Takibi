const yetkiKontrol = require('../middleware/yetkiKontrol');
const express = require('express');
const router = express.Router();
const Ilac = require('../models/Ilac');
const auth = require('../middleware/auth');

// TÜM İLAÇLARI LİSTELE (arama destekli)
router.get('/', auth, async (req, res) => {
  try {
    const { arama } = req.query;
    const filtre = {};

    if (arama) {
      filtre.$or = [
        { ilacAdi: { $regex: arama, $options: 'i' } },
        { barkod: { $regex: arama, $options: 'i' } }
      ];
    }

    const ilaclar = await Ilac.find(filtre).sort({ createdAt: -1 });
    res.json(ilaclar);
  } catch (err) {
    res.status(500).json({ mesaj: 'Sunucu hatası', hata: err.message });
  }
});

// YENİ İLAÇ EKLE
router.post('/', auth, yetkiKontrol('personel'), async (req, res) => {
  try {
    const { ilacAdi, barkod, stokMiktari, kritikStokSeviyesi, sonKullanmaTarihi, birimFiyat } = req.body;
    const yeniIlac = new Ilac({ ilacAdi, barkod, stokMiktari, kritikStokSeviyesi, sonKullanmaTarihi, birimFiyat });
    await yeniIlac.save();
    res.status(201).json({ mesaj: 'İlaç eklendi', ilac: yeniIlac });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ mesaj: 'Bu barkod zaten kayıtlı' });
    }
    res.status(500).json({ mesaj: 'Sunucu hatası', hata: err.message });
  }
});

// İLAÇ GÜNCELLE
router.put('/:id', auth, async (req, res) => {
  try {
    const guncelIlac = await Ilac.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!guncelIlac) {
      return res.status(404).json({ mesaj: 'İlaç bulunamadı' });
    }
    res.json({ mesaj: 'İlaç güncellendi', ilac: guncelIlac });
  } catch (err) {
    res.status(500).json({ mesaj: 'Sunucu hatası', hata: err.message });
  }
});
// TEK İLACI GETİR (düzenleme formu için)
router.get('/:id', auth, async (req, res) => {
  try {
    const ilac = await Ilac.findById(req.params.id);
    if (!ilac) {
      return res.status(404).json({ mesaj: 'İlaç bulunamadı' });
    }
    res.json(ilac);
  } catch (err) {
    res.status(500).json({ mesaj: 'Sunucu hatası', hata: err.message });
  }
});
// İLAÇ SİL
router.delete('/:id', auth, async (req, res) => {
  try {
    const silinen = await Ilac.findByIdAndDelete(req.params.id);
    if (!silinen) {
      return res.status(404).json({ mesaj: 'İlaç bulunamadı' });
    }
    res.json({ mesaj: 'İlaç silindi' });
  } catch (err) {
    res.status(500).json({ mesaj: 'Sunucu hatası', hata: err.message });
  }
});

module.exports = router;
