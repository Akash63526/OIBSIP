const express = require("express");
const router = express.Router();
const Ingredient = require("../models/Ingredient");

/*
|--------------------------------------------------------------------------
| GET ALL INGREDIENTS
|--------------------------------------------------------------------------
*/

router.get("/", async (req, res) => {
  try {
    const ingredients = await Ingredient.find({ isAvailable: true }).sort({ displayOrder: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: ingredients.length,
      data: ingredients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch ingredients",
      error: error.message,
    });
  }
});

module.exports = router;
