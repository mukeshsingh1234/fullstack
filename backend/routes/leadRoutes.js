
const express = require("express");
const router = express.Router();

const leadController = require("../controllers/leadController");
const authMiddleware = require("../middleware/authMiddleware");

// Public route: anyone can submit an inquiry
router.post("/", leadController.createLead);

// Protected routes: admin login required
router.get("/", authMiddleware, leadController.getLeads);
router.patch("/:id", authMiddleware, leadController.updateLead);
router.delete("/:id", authMiddleware, leadController.deleteLead);

module.exports = router;
