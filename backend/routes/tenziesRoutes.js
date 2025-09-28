const express = require("express");
const router = express.Router();
const tenziesController = require("../controllers/tenzisController");

router.post("/score", tenziesController.saveScore);
router.get("/scores", tenziesController.getScores);

module.exports = router;
