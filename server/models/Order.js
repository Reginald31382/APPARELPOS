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

    image: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

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
    customerEmail: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },

    items: [orderItemSchema],

    subtotal: {
      type: Number,
      required: true,
    },

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

    tax: {
      type: Number,
      default: 0,
    },

    shippingAddress: {
      firstName: String,
      lastName: String,
      company: String,
      address1: String,
      address2: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: "US",
      },
      phone: String,
      email: String,
    },

    shipping: {
      carrier: {
        type: String,
        default: "",
      },

      service: {
        type: String,
        default: "",
      },

      trackingNumber: {
        type: String,
        default: "",
      },

      cost: {
        type: Number,
        default: 0,
      },
    },

    total: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "Stripe"],
      default: "Stripe",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Refunded",
      ],
      default: "Pending",
    },

    stripeCheckoutSessionId: {
      type: String,
      default: "",
    },

    stripePaymentIntentId: {
      type: String,
      default: "",
    },

    refund: {
      amount: {
        type: Number,
        default: 0,
      },

      reason: {
        type: String,
        default: "",
      },

      refundedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      refundedAt: Date,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Order", orderSchema);
