const jwt=require('jsonwebtoken');
function auth(req,res,next){
    const token=req.header('Authorization')?.replace('Bearer ', '');
    if(!token){
        return res.status(401).json({ mesaj: 'Yetkilendirme gerekli,token yok' });
    }
    try {
        const decoded=jwt.verify(token, process.env.JWT_SECRET);
        req.user=decoded;
        next();
    } catch (err) {
        res.status(401).json({ mesaj: 'Geçersiz Token' });
    }
}
module.exports=auth;