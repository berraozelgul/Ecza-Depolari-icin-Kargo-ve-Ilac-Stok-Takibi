const mongoose=require("mongoose");
const kargoSchema=new mongoose.Schema({
    takipNo:{
        type:String,
        required:true,
        unique:true,
    },
    gonderen:{
        type:String,    
    required:true
    },
    alici:{
        type:String,    
    required:true
    },
    adres:{
type:String,
    required:true

    },
    durum:{
        type:String,
    enum: ['Hazırlanıyor', 'Kargoya Verildi', 'Yolda', 'Dağıtımda', 'Teslim Edildi', 'İptal'],
    default: 'Hazırlanıyor'
    }
}, { timestamps: true });
    module.exports = mongoose.model('Kargo', kargoSchema);