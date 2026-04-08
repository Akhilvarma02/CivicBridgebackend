const mongoose = require('mongoose');

const politicianSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    default: 'politician' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Politician', politicianSchema);
