const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Offer name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Percentage", "Fixed", "Free Shipping"],
      default: "Percentage",
    },
    discount: {
      type: String,
      required: [true, "Discount criteria display label is required"], // e.g. "20% OFF", "₹50 OFF"
      trim: true,
    },
    minOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
    usageLimit: {
      type: Number,
      default: 500,
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    validityStart: {
      type: Date,
      default: Date.now,
    },
    validityEnd: {
      type: Date,
      required: [true, "Validity expiration date is required"],
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    isNew: {
      type: Boolean,
      default: true,
    },
    priority: {
      type: Boolean,
      default: false, // maps to priority/featured offering star toggles
    },
    applicableSize: {
      type: String,
      enum: ["All Sizes", "Small", "Medium", "Large"],
      default: "All Sizes",
    },
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
  }
);

// Virtual property to output the usage summary e.g. "125 / 500" as expected by the frontend
couponSchema.virtual("usage").get(function () {
  return `${this.usageCount} / ${this.usageLimit === Infinity ? "∞" : this.usageLimit}`;
});

// Virtual property to format the validity span as expected by the frontend e.g. "10 May 2025 - 31 May 2025"
couponSchema.virtual("validity").get(function () {
  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  return `${formatDate(this.validityStart)} - ${formatDate(this.validityEnd)}`;
});

couponSchema.set("toJSON", { virtuals: true });
couponSchema.set("toObject", { virtuals: true });

couponSchema.index({ status: 1 });
couponSchema.index({ validityEnd: 1 });

module.exports = mongoose.model("Coupon", couponSchema);
