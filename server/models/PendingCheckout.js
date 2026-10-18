import mongoose from "mongoose";

const pendingCheckoutSchema = new mongoose.Schema(
  {
    stripeCheckoutSessionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    items: {
      type: [mongoose.Schema.Types.Mixed],
      required: true,
    },
    shippingAddress: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    shipping: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model("PendingCheckout", pendingCheckoutSchema);
