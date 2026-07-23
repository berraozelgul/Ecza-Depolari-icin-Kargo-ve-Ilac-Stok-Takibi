const mongoose = require('mongoose');

const siparisSchema = new mongoose.Schema({
  eczane: { type: mongoose.Schema.Types.ObjectId, ref: 'Eczane', required: true },
  urunler: [{
    ilac: { type: mongoose.Schema.Types.ObjectId, ref: 'Ilac' },
    miktar: Number,
  }],
  durum: {
    type: String,
    enum: ['Odeme Bekleniyor', 'Odeme Basarisiz', 'Beklemede', 'Onaylandı','Hazırlanıyor','Sevk Edildi', 'Teslim Edildi', 'İptal'],
    default: 'Odeme Bekleniyor',
  },
  kargo: { type: mongoose.Schema.Types.ObjectId, ref: 'Kargo' },
}, { timestamps: true });

module.exports = mongoose.model('Siparis', siparisSchema);