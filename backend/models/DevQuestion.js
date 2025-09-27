const { text } = require("express");
const mongoose = require("mongoose");
const choiceSchema = new mongoose.Schema({
    text:{
        type: String,
        required: true,
    },
    isCorrect:{
        type: Boolean,
        required: true,
    },
});

const devQuestionSchema = new mongoose.Schema({
    question:{
        type: String,
        required: true,
    },
    snippet:{
        type: String,
    },
    choices:[choiceSchema],
});

module.exports = mongoose.model("DevQuestion", devQuestionSchema);