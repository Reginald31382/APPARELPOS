import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | Store Information
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Taxes / Receipts
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Shipping
    |--------------------------------------------------------------------------
    */

    shipping: {
      businessName: {
        type: String,
        default: "J.Rome Apparel",
      },

      company: {
        type: String,
        default: "J.Rome LLC",
      },

      street1: {
        type: String,
        default: "",
      },

      street2: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        default: "",
      },

      state: {
        type: String,
        default: "",
      },

      zip: {
        type: String,
        default: "",
      },

      country: {
        type: String,
        default: "US",
      },

      phone: {
        type: String,
        default: "",
      },

      email: {
        type: String,
        default: "",
      },

      defaultCarrier: {
        type: String,
        default: "USPS",
      },

      defaultService: {
        type: String,
        default: "Ground Advantage",
      },

      packageLength: {
        type: Number,
        default: 12,
      },

      packageWidth: {
        type: Number,
        default: 10,
      },

      packageHeight: {
        type: Number,
        default: 2,
      },

      packageWeight: {
        type: Number,
        default: 16,
      },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Settings", settingsSchema);
