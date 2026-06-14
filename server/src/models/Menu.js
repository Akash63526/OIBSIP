const mongoose = require("mongoose");
const slugify = require("slugify");

/*
|--------------------------------------------------------------------------
| Reusable Sub Schemas
|--------------------------------------------------------------------------
*/

const optionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    extraPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

const sizeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["small", "medium", "large"],
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

/*
|--------------------------------------------------------------------------
| Main Menu Schema
|--------------------------------------------------------------------------
*/

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "veg-pizza",
        "nonveg-pizza",
        "sides",
        "pasta",
        "desserts",
        "beverages",
      ],
    },

    subCategory: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    galleryImages: [
      {
        type: String,
        trim: true,
      },
    ],

    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    sizes: [sizeSchema],

    crustOptions: [optionSchema],

    sauceOptions: [optionSchema],

    cheeseOptions: [optionSchema],

    toppings: [optionSchema],

    beverageSize: {
      type: String,
      enum: ["", "250ml", "300ml", "400ml", "500ml", "1L"],
      default: "",
    },

    isVeg: {
      type: Boolean,
      default: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isBestSeller: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    stock: {
      type: Number,
      default: 999,
      min: 0,
    },

    preparationTime: {
      type: Number,
      default: 20,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

/*
|--------------------------------------------------------------------------
| Auto Generate Slug
|--------------------------------------------------------------------------
*/

menuSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }
  next();
});

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

menuSchema.index({ category: 1 });
menuSchema.index({ isFeatured: 1 });
menuSchema.index({ isBestSeller: 1 });
menuSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Menu", menuSchema);