const mongoose = require('mongoose');
const { INGREDIENT_CATEGORIES } = require('../utils/constants');

const inventorySchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
      enum: Object.values(INGREDIENT_CATEGORIES),
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    threshold: {
      type: Number,
      required: true,
      min: 1,
      default: 20,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient threshold checking queries
inventorySchema.index({ stock: 1, threshold: 1 });

const Inventory = mongoose.model('Inventory', inventorySchema);
module.exports = Inventory;
