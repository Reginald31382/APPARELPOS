import mongoose from "mongoose";

const securityAnswerSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: true,
    },

    answerHash: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["Owner", "Admin", "Manager", "Cashier"],
      default: "Cashier",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    // Password recovery security questions
    securityQuestions: {
      type: [securityAnswerSchema],
      default: [],
    },

    // Recovery attempt protection
    recoveryAttempts: {
      type: Number,
      default: 0,
    },

    recoveryLockedUntil: {
      type: Date,
      default: null,
    },

    // One-time password recovery authorization
    resetTokenHash: {
      type: String,
      default: null,
    },

    resetTokenExpires: {
      type: Date,
      default: null,
    },

    // Password change tracking
    passwordChangedAt: {
      type: Date,
      default: null,
    },

    // Session invalidation support
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
