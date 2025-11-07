const mongoose = require("mongoose");
const Question = require("../models/Question");
require('dotenv').config();

const trueFalseQuestions = [
  { question: "JavaScript is a statically typed language.", answer: false },
  { question: "React is a library for building user interfaces.", answer: true },
  { question: "Node.js runs on the client-side.", answer: false },
  { question: "MongoDB is a NoSQL database.", answer: true },
  { question: "CSS stands for Cascading Style Sheets.", answer: true },
  { question: "The '===' operator in JavaScript checks both value and type.", answer: true },
  { question: "HTML is used to style web pages.", answer: false },
  { question: "Express.js is a framework for Node.js.", answer: true },
  { question: "In JavaScript, 'null' and 'undefined' are the same.", answer: false },
  { question: "Git is a version control system.", answer: true },
  { question: "The Python language was named after a snake.", answer: false },
  { question: "REST APIs usually use HTTP methods like GET and POST.", answer: true },
  { question: "React hooks cannot be used in class components.", answer: true },
  { question: "CSS Flexbox helps in creating responsive layouts.", answer: true },
  { question: "JavaScript supports multi-threading natively.", answer: false },
  { question: "MongoDB stores data in collections and documents.", answer: true },
  { question: "The 'for' loop in JavaScript can iterate over arrays.", answer: true },
  { question: "JSON stands for JavaScript Object Notation.", answer: true },
  { question: "SQL databases are always schema-less.", answer: false },
  { question: "TypeScript is a superset of JavaScript.", answer: true },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Question.deleteMany({}); 
    await Question.insertMany(trueFalseQuestions);

    console.log("Database seeded with True/False questions ✅");
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
};

seedDB();
