const mongoose = require("mongoose");
const { ProgrammingLanguage } = require("../models/AssemblyGame");
require('dotenv').config();

const programmingLanguages = [
  {
    name: "JAVASCRIPT",
    hint: "The language of the web, often used for frontend development",
    description: "High-level programming language"
  },
  {
    name: "PYTHON",
    hint: "Known for its simplicity and readability, used in data science",
    description: "Interpreted high-level programming language"
  },
  {
    name: "JAVA",
    hint: "Object-oriented language with 'write once, run anywhere' philosophy",
    description: "Class-based object-oriented programming language"
  },
  {
    name: "CPLUSPLUS",
    hint: "Extension of C language with object-oriented features",
    description: "General-purpose programming language"
  },
  {
    name: "RUBY",
    hint: "Dynamic language famous for its Ruby on Rails framework",
    description: "Dynamic, reflective object-oriented language"
  },
  {
    name: "GOLANG",
    hint: "Developed by Google, known for concurrency features",
    description: "Statically typed compiled language"
  },
  {
    name: "RUST",
    hint: "Systems programming language focused on safety and performance",
    description: "Multi-paradigm programming language"
  },
  {
    name: "SWIFT",
    hint: "Apple's language for iOS and macOS development",
    description: "General-purpose compiled programming language"
  },
  {
    name: "TYPESCRIPT",
    hint: "JavaScript with static typing, developed by Microsoft",
    description: "Strict syntactical superset of JavaScript"
  },
  {
    name: "PHP",
    hint: "Server-side scripting language especially suited to web development",
    description: "General-purpose scripting language"
  },
  {
    name: "KOTLIN",
    hint: "Modern language that can interoperate with Java",
    description: "Cross-platform, statically typed programming language"
  },
  {
    name: "SCALA",
    hint: "Combines object-oriented and functional programming",
    description: "Strongly typed programming language"
  },
  {
    name: "HASKELL",
    hint: "Purely functional programming language with strong static typing",
    description: "Standardized, general-purpose functional programming language"
  },
  {
    name: "ELIXIR",
    hint: "Functional language that runs on the Erlang virtual machine",
    description: "Functional, concurrent, general-purpose programming language"
  },
  {
    name: "CLOJURE",
    hint: "Modern Lisp that runs on the Java Virtual Machine",
    description: "Dynamic and functional dialect of the Lisp programming language"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB ✅");

    // Clear existing data
    await ProgrammingLanguage.deleteMany({}); 
    console.log("Cleared existing programming languages 🗑️");

    // Insert new data
    await ProgrammingLanguage.insertMany(programmingLanguages);
    console.log("Database seeded with Programming Languages for Assembly Game ✅");

    // Display what was added
    const count = await ProgrammingLanguage.countDocuments();
    console.log(`Total programming languages added: ${count} 📊`);

    // Show sample of added languages
    const sampleLanguages = await ProgrammingLanguage.find().limit(5);
    console.log("\nSample of added languages:");
    sampleLanguages.forEach((lang, index) => {
      console.log(`${index + 1}. ${lang.name} - ${lang.hint}`);
    });

    mongoose.connection.close();
    console.log("\nDatabase connection closed 🔒");
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
};

seedDB();