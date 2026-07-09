const mongoose = require('mongoose');
const eczaneSchema = new mongoose.Schema({
  eczaneAdi: { type: String, required: true },
  yetkiliKisi: String,
  telefon: String,
  adres: { type: String, required: true },
  vergiNo: String,
}, { timestamps: true });

module.exports = mongoose.model('Eczane', eczaneSchema);