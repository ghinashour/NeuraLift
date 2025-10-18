// backend/routes/noteRoutes.js
const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteUserController");
const protect  = require("../middleware/auth");

router.post("/", protect, noteController.createNote);
router.get("/", protect, noteController.getUserNotes);
router.delete("/:id", protect, noteController.deleteUserNote);
router.put("/:id", protect,noteController.updateUserNote);
module.exports = router;
