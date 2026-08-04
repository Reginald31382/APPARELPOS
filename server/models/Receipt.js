import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema(
  {
    receiptNumber: {
      type: String,
      unique: true,
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    customerEmail: {
      type: String,
      default: "",
      index: true,
    },

    orderType: {
      type: String,
      enum: ["Online", "POS"],
      default: "Online",
    },

    subtotal: Number,

    tax: Number,

    shipping: Number,

    discount: Number,

    total: Number,

    paymentMethod: String,

    paymentStatus: String,

    items: [
      {
        name: String,
        sku: String,
        color: String,
        size: String,
        quantity: Number,
        unitPrice: Number,
      },
    ],

    generatedAt: {
      type: Date,
      default: Date.now,
    },

    emailedAt: Date,

    downloadedAt: Date,

    printedAt: Date,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Receipt", receiptSchema);
