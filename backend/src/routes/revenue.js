const express = require("express");
const router = express.Router();
const Revenue = require("../models/Revenue");

// GET all revenue records
router.get("/", async (req, res) => {
  try {
    const revenues = await Revenue.find();
    res.json(revenues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
