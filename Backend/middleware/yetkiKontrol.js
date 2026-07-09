function yetkiKontrol(...izinliRoller) {
  return (req, res, next) => {
    if (!izinliRoller.includes(req.user.role)) {
      return res.status(403).json({ mesaj: 'Bu işlem için yetkiniz yok' });
    }
    next();
  };
}

module.exports = yetkiKontrol;