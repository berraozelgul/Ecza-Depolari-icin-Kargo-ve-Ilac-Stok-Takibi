const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const helmet=require("helmet");
require("dotenv").config();
const app=express();


app.use(helmet());
app.use(cors({
    // FRONTEND_URL .env'de tanımlıysa sadece o origin'e izin verilir.
    // Tanımlı değilse (yerel geliştirme) tüm origin'lere izin verir.
    origin: process.env.FRONTEND_URL || true
}));
app.use(express.json());
app.use('/api/siparis', require('./routes/siparis'));
app.use('/api/eczane', require('./routes/eczane'));
app.use('/api/ilac', require('./routes/ilac'));


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch((err) => console.log('MongoDB bağlantı hatası:', err));

app.get('/', (req, res) => {
  res.send('KargoTakip API çalışıyor');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/kargo', require('./routes/kargo'));
app.use('/api/paytr', require('./routes/paytr'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});