const mongoose = require('mongoose');

const ilacSchema = new mongoose.Schema({
  ilacAdi: { type: String, required: true },
  barkod: { type: String, unique: true },
  stokMiktari: { type: Number, default: 0 },
  kritikStokSeviyesi: { type: Number, default: 10 },
  sonKullanmaTarihi: Date,
  birimFiyat: Number,
}, { timestamps: true });

module.exports = mongoose.model('Ilac', ilacSchema);