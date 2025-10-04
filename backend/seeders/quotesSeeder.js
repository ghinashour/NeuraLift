// seed/quotesSeeder.js
const mongoose = require("mongoose");
const Quote = require("../models/Quote");
require("dotenv").config();

const quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
  { text: "You learn more from failure than from success.", author: "Unknown" },
  { text: "It's not whether you get knocked down, it's whether you get up.", author: "Vince Lombardi" },
  { text: "If you are working on something exciting, it will keep you motivated.", author: "Unknown" },
  { text: "Success is not in what you have, but who you are.", author: "Bo Bennett" },
];

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log("DB connected. Seeding quotes...");

    await Quote.deleteMany(); // optional: clear existing quotes
    await Quote.insertMany(quotes);

    console.log("Quotes seeded successfully!");
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("DB connection failed:", err);
  });
