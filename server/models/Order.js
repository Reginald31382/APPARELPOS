import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: String,

    sku: String,

    color: String,

    size: String,

    quantity: Number,

    unitPrice: Number,
  },
  {
    _id: false,
  },
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },

    items: [orderItemSchema],

    subtotal: Number,

    discount: {
      type: Number,
      default: 0,
    },

    discountType: {
      type: String,
      enum: ["Percentage", "Amount"],
      default: "Amount",
    },

    discountReason: {
      type: String,
      default: "",
    },

    tax: Number,

    total: Number,

    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "Stripe"],
      default: "Stripe",
    },

    status: {
      type: String,
      enum: ["Pending", "Paid", "Refunded", "Cancelled"],
      default: "Pending",
    },
    stripePaymentIntentId: {
      type: String,
      default: "",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Order", orderSchema);
