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

    shippingRules: {
      freeShippingThreshold: {
        type: Number,
        default: 150,
      },

      lightweightMaxOz: {
        type: Number,
        default: 16,
      },

      defaultCarrier: {
        type: String,
        default: "USPS",
      },

      lightweightService: {
        type: String,
        default: "Ground Advantage",
      },

      heavyweightService: {
        type: String,
        default: "Priority Mail",
      },

      expressService: {
        type: String,
        default: "Priority Mail Express",
      },

      alwaysUseUSPS: {
        type: Boolean,
        default: true,
      },
    },

    smsNotifications: {
      enabled: {
        type: Boolean,
        default: false,
      },

      phone: {
        type: String,
        default: "",
      },
    },

    // -------------------------------
    // Shipping Settings
    // -------------------------------

    shipping: {
      businessName: {
        type: String,
        default: "",
      },

      company: {
        type: String,
        default: "",
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

export default mongoose.model("Store", storeSchema);
