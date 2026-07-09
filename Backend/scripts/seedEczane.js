const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const Eczane = require('../models/Eczane');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB bağlantısı başarılı');

    const dosyaYolu = path.join(__dirname, '../data/eczaneler.yaml');
    const dosyaIcerigi = fs.readFileSync(dosyaYolu, 'utf8');
    const eczaneler = yaml.load(dosyaIcerigi);

    console.log(`${eczaneler.length} eczane bulundu, ekleniyor...`);

    let eklenen = 0;
    for (const eczane of eczaneler) {
      const varMi = await Eczane.findOne({ eczaneAdi: eczane.eczaneAdi });
      if (varMi) {
        console.log(`Atlandı (zaten var): ${eczane.eczaneAdi}`);
        continue;
      }
      await Eczane.create(eczane);
      eklenen++;
    }

    console.log(`Tamamlandı: ${eklenen} eczane eklendi.`);
    process.exit(0);
  } catch (err) {
    console.error('Hata:', err);
    process.exit(1);
  }
}

seed();