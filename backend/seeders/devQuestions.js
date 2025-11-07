const mongoose = require("mongoose");
const DevQuestion = require("../models/DevQuestion");
require('dotenv').config();

const devQuestions = [
  {
    question: "What will the following JavaScript code output?",
    snippet: "console.log(typeof null);",
    choices: [
      { text: "object", isCorrect: true },
      { text: "null", isCorrect: false },
      { text: "undefined", isCorrect: false },
      { text: "number", isCorrect: false },
    ],
  },
  {
    question: "What is the output of this Python code?",
    snippet: "print(2 ** 3 ** 2)",
    choices: [
      { text: "64", isCorrect: false },
      { text: "512", isCorrect: true }, // 2 ** (3**2)
      { text: "16", isCorrect: false },
      { text: "Error", isCorrect: false },
    ],
  },
  {
    question: "What will this code return in JavaScript?",
    snippet: "console.log([1, 2, 3] + [4, 5, 6]);",
    choices: [
      { text: "[1,2,3,4,5,6]", isCorrect: false },
      { text: "1,2,34,5,6", isCorrect: true },
      { text: "Error", isCorrect: false },
      { text: "'1,2,34,5,6'", isCorrect: false },
    ],
  },
  {
    question: "What is the output of the following code in C?",
    snippet: `#include <stdio.h>
int main() {
    int a = 5;
    printf("%d", a++ + ++a);
    return 0;
}`,
    choices: [
      { text: "11", isCorrect: false },
      { text: "12", isCorrect: false },
      { text: "Compiler Error", isCorrect: false },
      { text: "Undefined Behavior", isCorrect: true },
    ],
  },
  {
    question: "What will this SQL query return?",
    snippet: `SELECT COUNT(*) 
FROM users 
WHERE age > 30 AND age < 20;`,
    choices: [
      { text: "0", isCorrect: true },
      { text: "NULL", isCorrect: false },
      { text: "Error", isCorrect: false },
      { text: "All users", isCorrect: false },
    ],
  },
  {
    question: "What does this Java code print?",
    snippet: `String s1 = "hello";
String s2 = new String("hello");
System.out.println(s1 == s2);`,
    choices: [
      { text: "true", isCorrect: false },
      { text: "false", isCorrect: true },
      { text: "hello", isCorrect: false },
      { text: "Error", isCorrect: false },
    ],
  },
];

const seedDevDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await DevQuestion.deleteMany({});
    await DevQuestion.insertMany(devQuestions);

    console.log("✅ Database seeded with Dev Questions!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  }
};

seedDevDB();
