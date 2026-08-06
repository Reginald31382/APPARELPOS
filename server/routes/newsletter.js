import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    await axios.post(
      "https://api.brevo.com/v3/contacts",
      {
        email,
        updateEnabled: true,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    res.json({
      success: true,
      message: "Successfully subscribed.",
    });
  } catch (error) {
    console.error(error.response?.data || error.message);

    const status = error.response?.status;

    if (status === 400) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    if (status === 409) {
      return res.status(200).json({
        message: "You're already subscribed!",
      });
    }

    res.status(500).json({
      message: "Something went wrong. Please try again.",
    });
  }
});

export default router;
