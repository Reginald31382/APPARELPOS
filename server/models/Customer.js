import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      unique: true,
    },

    email: {
      type: String,
      default: "",
    },

    loyaltyPoints: {
      type: Number,
      default: 0,
    },

    notes: {
      type: String,
      default: "",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Customer", customerSchema);
