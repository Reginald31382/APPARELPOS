import NewsletterSubscriber from "../models/NewsletterSubscriber.js";
import { addSubscriberToBrevo } from "../services/brevoService.js";

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const exists = await NewsletterSubscriber.findOne({
      email: normalizedEmail,
    });

    if (exists) {
      return res.status(200).json({
        success: true,
        message: "You're already subscribed.",
      });
    }

    const subscriber = await NewsletterSubscriber.create({
      email: normalizedEmail,
      status: "Subscribed",
      source: "Website",
    });

    try {
      await addSubscriberToBrevo(normalizedEmail);
    } catch (brevoError) {
      // If MongoDB saved the subscriber but Brevo failed,
      // remove the database record so the two systems stay consistent.
      await NewsletterSubscriber.findByIdAndDelete(subscriber._id);

      throw brevoError;
    }

    return res.status(201).json({
      success: true,
      message: "Successfully subscribed.",
    });
  } catch (error) {
    console.error(
      "Newsletter subscription error:",
      error.response?.data || error.message,
    );

    const status = error.response?.status;

    if (status === 400) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    return res.status(500).json({
      message: "Subscription failed. Please try again.",
    });
  }
};
