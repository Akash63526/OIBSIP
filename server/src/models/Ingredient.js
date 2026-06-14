const mongoose = require("mongoose");

/*
|--------------------------------------------------------------------------
| Ingredient Schema
|--------------------------------------------------------------------------
| Used for:
| - Crust Options
| - Sauce Options
| - Cheese Options
| - Veg Toppings
| - Meat Toppings
|--------------------------------------------------------------------------
*/

const ingredientSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | Ingredient Name
    |--------------------------------------------------------------------------
    */
    name: {
      type: String,
      required: [true, "Ingredient name is required"],
      trim: true,
      maxlength: [100, "Ingredient name cannot exceed 100 characters"],
    },

    /*
    |--------------------------------------------------------------------------
    | Slug
    |--------------------------------------------------------------------------
    */
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Category
    |--------------------------------------------------------------------------
    */
    category: {
      type: String,
      required: [true, "Ingredient category is required"],
      enum: [
        "crust",
        "sauce",
        "cheese",
        "veg-topping",
        "meat-topping",
      ],
    },

    /*
    |--------------------------------------------------------------------------
    | Image
    |--------------------------------------------------------------------------
    */
    image: {
      type: String,
      default: "",
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Extra Price
    |--------------------------------------------------------------------------
    */
    extraPrice: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },

    /*
    |--------------------------------------------------------------------------
    | Availability
    |--------------------------------------------------------------------------
    */
    isAvailable: {
      type: Boolean,
      default: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Veg / Non-Veg
    |--------------------------------------------------------------------------
    */
    isVeg: {
      type: Boolean,
      default: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Bestseller Tag
    |--------------------------------------------------------------------------
    */
    isPopular: {
      type: Boolean,
      default: false,
    },

    /*
    |--------------------------------------------------------------------------
    | Sort Order
    |--------------------------------------------------------------------------
    */
    displayOrder: {
      type: Number,
      default: 0,
      min: 0,
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

ingredientSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }
  next();
});

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

ingredientSchema.index({ category: 1 });
ingredientSchema.index({ isAvailable: 1 });
ingredientSchema.index({ displayOrder: 1 });

module.exports = mongoose.model("Ingredient", ingredientSchema);
