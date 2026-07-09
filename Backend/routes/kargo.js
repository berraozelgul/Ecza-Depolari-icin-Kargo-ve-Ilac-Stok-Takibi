const express = require('express');
const router = express.Router();
const Kargo = require('../models/Kargo');
const auth = require('../middleware/auth');

// TÜM KARGOLARI LİSTELE (herkes görebilir - sorgulama için)
router.get('/', async (req, res) => {
  try {
    const kargolar = await Kargo.find().sort({ createdAt: -1 });
    res.json(kargolar);
  } catch (err) {
    res.status(500).json({ mesaj: 'Sunucu hatası', hata: err.message });
  }
});
// İSTATİSTİK ÖZETİ (herkes görebilir, dashboard için kullanılacak)
router.get('/istatistik/ozet', async (req, res) => {
  try {
    const tumKargolar = await Kargo.find();

    const ozet = {
      toplam: tumKargolar.length,
      durumDagilimi: {}
    };

    const durumlar = ['Hazırlanıyor', 'Kargoya Verildi', 'Yolda', 'Dağıtımda', 'Teslim Edildi', 'İptal'];
    durumlar.forEach((durum) => {
      ozet.durumDagilimi[durum] = tumKargolar.filter((k) => k.durum === durum).length;
    });

    res.json(ozet);
  } catch (err) {
    res.status(500).json({ mesaj: 'Sunucu hatası', hata: err.message });
  }
});
// TAKİP NUMARASINA GÖRE TEK KARGO SORGULA (herkes görebilir)
router.get('/:takipNo', async (req, res) => {
  try {
    const kargo = await Kargo.findOne({ takipNo: req.params.takipNo });
    if (!kargo) {
      return res.status(404).json({ mesaj: 'Bu takip numarasına ait kargo bulunamadı' });
    }
    res.json(kargo);
  } catch (err) {
    res.status(500).json({ mesaj: 'Sunucu hatası', hata: err.message });
  }
});

// YENİ KARGO EKLE (sadece giriş yapmış personel)
router.post('/', auth, async (req, res) => {
  try {
    const { takipNo, gonderen, alici, adres, durum } = req.body;

    const yeniKargo = new Kargo({ takipNo, gonderen, alici, adres, durum });
    await yeniKargo.save();

    res.status(201).json({ mesaj: 'Kargo başarıyla oluşturuldu', kargo: yeniKargo });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ mesaj: 'Bu takip numarası zaten kayıtlı' });
    }
    res.status(500).json({ mesaj: 'Sunucu hatası', hata: err.message });
  }
});

// KARGO DURUMUNU GÜNCELLE (sadece giriş yapmış personel)
router.put('/:id', auth, async (req, res) => {
  try {
    const guncelKargo = await Kargo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!guncelKargo) {
      return res.status(404).json({ mesaj: 'Kargo bulunamadı' });
    }

    res.json({ mesaj: 'Kargo güncellendi', kargo: guncelKargo });
  } catch (err) {
    res.status(500).json({ mesaj: 'Sunucu hatası', hata: err.message });
  }
});

// KARGO SİL (sadece giriş yapmış personel)
router.delete('/:id', auth, async (req, res) => {
  try {
    const silinenKargo = await Kargo.findByIdAndDelete(req.params.id);

    if (!silinenKargo) {
      return res.status(404).json({ mesaj: 'Kargo bulunamadı' });
    }

    res.json({ mesaj: 'Kargo silindi' });
  } catch (err) {
    res.status(500).json({ mesaj: 'Sunucu hatası', hata: err.message });
  }
});



module.exports = router;