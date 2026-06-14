const mongoose = require('mongoose');
const { ORDER_STATUS } = require('../utils/constants');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        pizzaId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Menu',
        },
        isCustom: {
          type: Boolean,
          default: false,
        },
        pizzaConfig: {
          base: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' },
          sauce: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' },
          cheese: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' },
          veggies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' }],
          meat: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' }],
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      }
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.ORDER_RECEIVED,
    },
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
    },
    razorpayOrderId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
