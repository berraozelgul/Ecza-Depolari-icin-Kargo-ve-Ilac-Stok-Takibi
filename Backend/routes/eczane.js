const yetkiKontrol = require('../middleware/yetkiKontrol');
const express = require('express');
const router = express.Router();
const Eczane = require('../models/Eczane');
const auth = require('../middleware/auth');

// TÜM ECZANELERİ LİSTELE (arama destekli)
// personel: hepsini görür / eczane: sadece kendi kaydını görür
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role === 'eczane') {
      if (!req.user.eczane) {
        return res.json([]);
      }
      const kendiEczanem = await Eczane.findById(req.user.eczane);
      return res.json(kendiEczanem ? [kendiEczanem] : []);
    }

    const { arama } = req.query;
    const filtre = {};

    if (arama) {
      filtre.$or = [
        { eczaneAdi: { $regex: arama, $options: 'i' } },
        { yetkiliKisi: { $regex: arama, $options: 'i' } }
      ];
    }

    const eczaneler = await Eczane.find(filtre).sort({ createdAt: -1 });
    res.json(eczaneler);
  } catch (err) {
    res.status(500).json({ mesaj: 'Sunucu hatası', hata: err.message });
  }
});

// YENİ ECZANE EKLE
router.post('/', auth, yetkiKontrol('personel'), async (req, res) => {
  try {
    const { eczaneAdi, yetkiliKisi, telefon, adres, vergiNo } = req.body;
    const yeniEczane = new Eczane({ eczaneAdi, yetkiliKisi, telefon, adres, vergiNo });
    await yeniEczane.save();
    res.status(201).json({ mesaj: 'Eczane eklendi', eczane: yeniEczane });
  } catch (err) {
    res.status(500).json({ mesaj: 'Sunucu hatası', hata: err.message });
  }
});

// ECZANE GÜNCELLE
router.put('/:id', auth, yetkiKontrol('personel'), async (req, res) => {
  try {
    const guncelEczane = await Eczane.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!guncelEczane) {
      return res.status(404).json({ mesaj: 'Eczane bulunamadı' });
    }
    res.json({ mesaj: 'Eczane güncellendi', eczane: guncelEczane });
  } catch (err) {
    res.status(500).json({ mesaj: 'Sunucu hatası', hata: err.message });
  }
});

// TEK ECZANEYİ GETİR (düzenleme formu için)
router.get('/:id', auth, async (req, res) => {
  try {
    const eczane = await Eczane.findById(req.params.id);
    if (!eczane) {
      return res.status(404).json({ mesaj: 'Eczane bulunamadı' });
    }
    res.json(eczane);
  } catch (err) {
    res.status(500).json({ mesaj: 'Sunucu hatası', hata: err.message });
  }
});

// ECZANE SİL
router.delete('/:id', auth, yetkiKontrol('personel'), async (req, res) => {
  try {
    const silinen = await Eczane.findByIdAndDelete(req.params.id);
    if (!silinen) {
      return res.status(404).json({ mesaj: 'Eczane bulunamadı' });
    }
    res.json({ mesaj: 'Eczane silindi' });
  } catch (err) {
    res.status(500).json({ mesaj: 'Sunucu hatası', hata: err.message });
  }
});

module.exports = router;