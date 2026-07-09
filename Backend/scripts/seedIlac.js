const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const Ilac = require('../models/Ilac');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB bağlantısı başarılı');

    const dosyaYolu = path.join(__dirname, '../data/ilaclar.yaml');
    const dosyaIcerigi = fs.readFileSync(dosyaYolu, 'utf8');
    const ilaclar = yaml.load(dosyaIcerigi);

    console.log(`${ilaclar.length} ilaç bulundu, işleniyor...`);

    let eklenen = 0;
    let guncellenen = 0;

    for (const ilac of ilaclar) {
      const sonuc = await Ilac.findOneAndUpdate(
        { barkod: ilac.barkod },
        { $set: ilac },
        { upsert: true, new: true, rawResult: true }
      );

      if (sonuc.lastErrorObject?.upserted) {
        eklenen++;
      } else {
        guncellenen++;
      }
    }

    console.log(`Tamamlandı: ${eklenen} yeni ilaç eklendi, ${guncellenen} tanesi güncellendi.`);
    process.exit(0);
  } catch (err) {
    console.error('Hata:', err);
    process.exit(1);
  }
}

seed();