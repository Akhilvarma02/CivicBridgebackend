const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  issueId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Citizen', required: true },
  areaType: { type: String, required: true },
  town: { type: String, required: true },
  issueType: { type: String, required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Submitted', 'In Progress', 'Resolved'], 
    default: 'Submitted' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Issue', issueSchema);
