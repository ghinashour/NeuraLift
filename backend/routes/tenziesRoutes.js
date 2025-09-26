const express = require("express");
const router = express.Router();
const tenziesController = require("../controllers/tenziesController");

router.post("/score", tenziesController.saveScore);
router.get("/scores", tenziesController.getScores);

module.exports = router;
