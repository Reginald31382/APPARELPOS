import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      default: "J.Rome Apparel",
    },

    logo: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
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

    taxRate: {
      type: Number,
      default: 0.06,
    },

    receiptFooter: {
      type: String,
      default: "Thank you for shopping with us!",
    },

    autoPrintReceipts: {
      type: Boolean,
      default: false,
    },

    defaultPaymentMethod: {
      type: String,
      enum: ["Cash", "Stripe"],
      default: "Cash",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Settings", settingsSchema);
