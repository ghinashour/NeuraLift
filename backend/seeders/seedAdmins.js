// scripts/addAdmins.js
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config(); 

// List of admins to add
const admins = [
  { name: 'ghina shour', email: 'shourghina@gmail.com', password: 'ghina1234' },
  { name: 'hassan ramadan', email: 'admin2@example.com', password: 'AdminPass2hassan' },
  { name: 'yara', email: 'admin3@example.com', password: 'AdminPass3yara' },
  { name: 'mhmd', email: 'admin4@example.com', password: 'AdminPass4mhmd' },
  { name: 'omar Moussa', email: 'admin5@example.com', password: 'AdminPass5omar' },
];

const addAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    for (const adminData of admins) {
      const existing = await Admin.findOne({ email: adminData.email });
      if (existing) {
        console.log(`Admin with email ${adminData.email} already exists`);
        continue;
      }

      const admin = new Admin(adminData);
      await admin.save();
      console.log(`Admin ${adminData.email} added`);
    }

    console.log('All admins processed');
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
    mongoose.disconnect();
  }
};

addAdmins();
