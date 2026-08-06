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

    const exists = await NewsletterSubscriber.findOne({
      email,
    });

    if (exists) {
      return res.json({
        message: "Already subscribed.",
      });
    }

    await NewsletterSubscriber.create({
      email,
    });

    await addSubscriberToBrevo(email);

    res.status(201).json({
      message: "Successfully subscribed.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Subscription failed.",
    });
  }
};
