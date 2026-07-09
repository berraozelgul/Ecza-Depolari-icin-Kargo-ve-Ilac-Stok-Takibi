const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const User=require('../models/User');
//KAYIT
router.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        const mevcutKullanici = await User.findOne({ username });
        if (mevcutKullanici) {
            return res.status(400).json({ mesaj: 'Kullanıcı adı zaten mevcut' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashliSifre = await bcrypt.hash(password, salt);
        const yeniKullanici = new User({
            username,
            password: hashliSifre,
            role: role === 'eczane' ? 'eczane' : 'personel'  // güvenlik: sadece bu iki değer kabul edilir
        });
        await yeniKullanici.save();
        res.status(201).json({ mesaj: 'Kullanıcı başarıyla oluşturuldu' });
    } catch (err) {
        res.status(500).json({ mesaj: 'Sunucu hatası', hata: err.message });
    }
});
//GİRİŞ
router.post('/login',async(req,res)=>{
    try{
        const{username,password}=req.body;

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
            { id:kullanici._id,username:kullanici.username,role:kullanici.role},
            process.env.JWT_SECRET,
            {expiresIn:'8h'}
        );
        res.json({mesaj:'Giriş başarılı',token,username:kullanici.username,role:kullanici.role});
    } catch (err) {
        res.status(500).json({mesaj:'Sunucu hatası',hata:err.message});
    }
});

module.exports=router;