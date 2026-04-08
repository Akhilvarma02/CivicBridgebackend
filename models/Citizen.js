const mongoose = require('mongoose');

const citizenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    default: 'citizen' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Citizen', citizenSchema);
