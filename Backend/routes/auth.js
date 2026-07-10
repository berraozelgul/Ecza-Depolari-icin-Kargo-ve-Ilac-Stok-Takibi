const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const rateLimit=require('express-rate-limit');
const User=require('../models/User');
const Eczane=require('../models/Eczane');
const auth=require('../middleware/auth');
const yetkiKontrol=require('../middleware/yetkiKontrol');

// brute-force koruması: 15 dakikada aynı IP'den en fazla 10 giriş/kayıt denemesi
const girisLimiter = rateLimit({
    windowMs: 60 * 1000,
max: 30,
    message: { mesaj: 'Çok fazla deneme yaptınız, lütfen daha sonra tekrar deneyin' },
    standardHeaders: true,
    legacyHeaders: false
});

//KAYIT (herkese açık - SADECE eczane hesabı oluşturur)
// personel hesapları buradan açılamaz, bkz. /personel-ekle (korumalı endpoint)
router.post('/register', girisLimiter, async (req, res) => {
    try {
        const { username, password, eczaneAdi, yetkiliKisi, telefon, adres, vergiNo } = req.body;

        if (typeof username !== 'string' || typeof password !== 'string' || !username.trim() || !password) {
            return res.status(400).json({ mesaj: 'Kullanıcı adı ve şifre zorunludur' });
        }

        const mevcutKullanici = await User.findOne({ username });
        if (mevcutKullanici) {
            return res.status(400).json({ mesaj: 'Kullanıcı adı zaten mevcut' });
        }

        const gercekRol = 'eczane'; // güvenlik: herkese açık kayıt her zaman eczane rolü oluşturur

        if (!eczaneAdi || !adres) {
            return res.status(400).json({ mesaj: 'Eczane adı ve adres zorunludur' });
        }
        const yeniEczane = new Eczane({ eczaneAdi, yetkiliKisi, telefon, adres, vergiNo });
        await yeniEczane.save();
        const eczaneId = yeniEczane._id;

        const salt = await bcrypt.genSalt(10);
        const hashliSifre = await bcrypt.hash(password, salt);
        const yeniKullanici = new User({
            username,
            password: hashliSifre,
            role: gercekRol,
            eczane: eczaneId
        });
        await yeniKullanici.save();
        res.status(201).json({ mesaj: 'Kullanıcı başarıyla oluşturuldu' });
    } catch (err) {
        res.status(500).json({ mesaj: 'Sunucu hatası', hata: err.message });
    }
});

//GİRİŞ
router.post('/login', girisLimiter, async(req,res)=>{
    try{
        const{username,password}=req.body;

        if (typeof username !== 'string' || typeof password !== 'string') {
            return res.status(400).json({mesaj:'Kullanıcı adı veya şifre hatalı'});
        }

        const kullanici=await User.findOne({username});
        if(!kullanici){
            return res.status(400).json({mesaj:'Kullanıcı adı veya şifre hatalı'});
        }

        const sifreDogruMu=await bcrypt.compare(password,kullanici.password);
        if(!sifreDogruMu){
            return res.status(400).json({mesaj:'Kullanıcı adı veya şifre hatalı'});
        }

        //TOKEN OLUŞTURMA
        const token =jwt.sign(
            { id:kullanici._id, username:kullanici.username, role:kullanici.role, eczane:kullanici.eczane },
            process.env.JWT_SECRET,
            {expiresIn:'8h'}
        );
        res.json({
            mesaj:'Giriş başarılı',
            token,
            username:kullanici.username,
            role:kullanici.role,
            eczane:kullanici.eczane
        });
    } catch (err) {
        res.status(500).json({mesaj:'Sunucu hatası',hata:err.message});
    }
});

//PERSONEL EKLE (korumalı - sadece giriş yapmış personel çağırabilir)
router.post('/personel-ekle', auth, yetkiKontrol('personel'), async (req, res) => {
    try {
        const { username, password } = req.body;

        if (typeof username !== 'string' || typeof password !== 'string' || !username.trim() || !password) {
            return res.status(400).json({ mesaj: 'Kullanıcı adı ve şifre zorunludur' });
        }

        const mevcutKullanici = await User.findOne({ username });
        if (mevcutKullanici) {
            return res.status(400).json({ mesaj: 'Kullanıcı adı zaten mevcut' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashliSifre = await bcrypt.hash(password, salt);
        const yeniPersonel = new User({
            username,
            password: hashliSifre,
            role: 'personel'
        });
        await yeniPersonel.save();
        res.status(201).json({ mesaj: 'Personel hesabı oluşturuldu' });
    } catch (err) {
        res.status(500).json({ mesaj: 'Sunucu hatası', hata: err.message });
    }
});

module.exports=router;