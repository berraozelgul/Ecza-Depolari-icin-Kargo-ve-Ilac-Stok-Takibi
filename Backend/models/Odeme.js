const mongoose = require('mongoose');

const odemeSchema=new mongoose.Schema({
siparis:{type:mongoose.Schema.Types.ObjectId,ref:'Siparis',required:true},
merchantOid:{type:String,required:true,unique:true},
tutar:{type:Number,required:true},
hataMesaji:{type:String},
durum:{
    type:String,
    enum:['Beklemede','Basarili','Basarisiz'],
    default:'Beklemede'
},
},{timestamps:true});


module.exports=mongoose.model('Odeme',odemeSchema);