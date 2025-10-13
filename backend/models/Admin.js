const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true
 },
  email: {
     type: String,
     required: true,
     unique: true
     },
  password: {
     type: String,
     required: true
 },
});

// Hash password before saving using a pre hook 
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
adminSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
