const express = require("express");
const router=express.Router();
const Siparis=require('../models/Siparis');
const Odeme=require('../models/Odeme');
const auth=require('../middleware/auth');
const paytrService=require('../services/paytrService');

function tutarHesapla(urunler){
  return urunler.reduce((toplam,kalem)=>{
return toplam + (kalem.ilac.birimFiyat * kalem.miktar);
  },0);
}
//POST/baslat
router.post('/baslat', auth, async (req, res) => {
  try {
    const { siparisId } = req.body;
    const siparis = await Siparis.findById(siparisId).populate('urunler.ilac');

    if (!siparis) {
      return res.status(404).json({ mesaj: 'Sipariş bulunamadı' });
    }
    const tutar=tutarHesapla(siparis.urunler);

const merchantOid=`SPR${siparis._id}${Date.now()}`;
//bu satır ne yapıyor: SPR harfleri ile başlayan arkasına siparişin IDsini arkasına da o anki zamanı(milisaniye) ekleyen bir metin üretiyor.Amaç: her ödeme denemesi için tekrarlanmayan,benzersiz bir kod üretmek.

const odeme=await Odeme.create({
    siparis:siparis._id, //hangi siparişe ait olduğu
    merchantOid, //az önce üretilen değişken
    tutar, 
});

const sonuc=await paytrService.tokenAl({merchantOid})
res.json({
    token:sonuc.token,
    mock:sonuc.mock,
    merchantOid,
    tutar,
});
} catch (err) {
    return res.status(500).json({ mesaj: 'Sunucu hatası' });
  }
});

router.post('/mock-tamamla',auth,async(req,res)=>{
  try{
    const{merchantOid,basarili}=req.body;
    const odeme=await Odeme.findOne({merchantOid});
    if(!odeme){
      return res.status(404).json({mesaj:'Ödeme kaydı bulunamadı'});
    }
    odeme.durum=basarili?'Basarili':'Basarisiz';
    await odeme.save();
    if(basarili){
      await Siparis.findByIdAndUpdate(odeme.siparis,{durum:'Beklemede'});
    }else{
      await Siparis.findByIdAndUpdate(odeme.siparis,{durum:'Odeme Basarisiz'});
    }
    res.json({mesaj:'Ödeme sonucu işlendi',durum:odeme.durum});
  } catch(err){
return res.status(500).json({mesaj:'Sunucu hatası'});
  }
});
module.exports=router;