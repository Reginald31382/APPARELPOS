import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      default: "J.Rome Apparel",
    },

    phone: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    taxRate: {
      type: Number,
      default: 6,
    },

    freeShippingThreshold: {
      type: Number,
      default: 150,
    },

    receiptFooter: {
      type: String,
      default: "Thank you for shopping with J.Rome Apparel!",
    },

    autoPrintReceipts: {
      type: Boolean,
      default: true,
    },

    defaultPaymentMethod: {
      type: String,
      default: "Cash",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Store", storeSchema);
