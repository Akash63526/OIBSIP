const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Pizza name is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Pizza description is required'],
    },
    image: {
      type: String,
      required: [true, 'Pizza image URL is required'],
    },
    category: {
      type: String,
      required: true,
      enum: ['Veg', 'Non-Veg', 'Vegan'],
    },
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: 0,
    },
    ingredients: [
      {
        ingredientId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Inventory',
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    availability: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Pizza = mongoose.model('Pizza', pizzaSchema);
module.exports = Pizza;
