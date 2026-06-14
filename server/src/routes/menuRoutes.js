const express = require("express");
const router = express.Router();
const Menu = require("../models/Menu");

/*
|--------------------------------------------------------------------------
| GET ALL MENU ITEMS
|--------------------------------------------------------------------------
*/

router.get("/", async (req, res) => {
  try {
    const menu = await Menu.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: menu.length,
      data: menu,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch menu",
      error: error.message,
    });
  }
});

module.exports = router;
