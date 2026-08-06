import mongoose from "mongoose";

const newsletterSubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    status: {
      type: String,
      default: "Subscribed",
    },

    source: {
      type: String,
      default: "Website",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model(
  "NewsletterSubscriber",
  newsletterSubscriberSchema,
);
