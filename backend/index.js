require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');

const app = express();

app.use(express.json());
app.use(cookieParser());

// Allow frontend to send cookies: set origin to your frontend url
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Mongo connected');
    app.listen(PORT, () => console.log(`Server started on ${PORT}`));
  })
  .catch(err => console.error(err));
