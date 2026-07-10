const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Kullanım: node scripts/seedPersonel.js <kullanici_adi> <sifre>
// Register endpoint'i artık sadece eczane hesabı açtığı için,
// sistemdeki İLK personel (yönetici) hesabı buradan elle oluşturulur.
// Sonraki personel hesapları giriş yapmış bir personel tarafından
// /api/auth/personel-ekle üzerinden açılabilir.

async function seed() {
  const [, , username, password] = process.argv;

  if (!username || !password) {
    console.error('Kullanım: node scripts/seedPersonel.js <kullanici_adi> <sifre>');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB bağlantısı başarılı');

    const varMi = await User.findOne({ username });
    if (varMi) {
      console.log(`Atlandı (zaten var): ${username}`);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashliSifre = await bcrypt.hash(password, salt);
    await User.create({ username, password: hashliSifre, role: 'personel' });

    console.log(`Personel hesabı oluşturuldu: ${username}`);
    process.exit(0);
  } catch (err) {
    console.error('Hata:', err);
    process.exit(1);
  }
}

seed();
