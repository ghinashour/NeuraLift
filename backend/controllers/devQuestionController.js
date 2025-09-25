const DevQuestion = require("../models/DevQuestion");

exports.getDevQuestions = async (req, res) => {
    try {
        const questions = await DevQuestion.aggregate([{ $sample: { size: 5 } }]);
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch development questions" });
    }
};