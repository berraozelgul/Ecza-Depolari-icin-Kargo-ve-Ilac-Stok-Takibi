const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'personel'
  },
  eczane: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Eczane',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);