import axios from "axios";
import { receiptTemplate } from "./receiptTemplate.js";

export const sendReceiptEmail = async (order) => {
  if (!order.customerEmail) {
    console.log("Receipt email skipped (no customer email).");
    return;
  }

  const htmlContent = receiptTemplate(order);

  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: process.env.BREVO_SENDER_NAME,
          email: process.env.BREVO_SENDER_EMAIL,
        },

        to: [
          {
            email: order.customerEmail,
            name: `${order.shippingAddress?.firstName || ""} ${order.shippingAddress?.lastName || ""}`.trim(),
          },
        ],

        subject: `Your J.Rome Apparel Receipt #${order.orderNumber}`,

        htmlContent,
      },
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
      },
    );

    // console.log(`📧 Receipt sent to ${order.shippingAddress.email}`);
  } catch (error) {
    console.error("Brevo Receipt Error:");

    console.error(error.response?.data || error.message);

    // Prevent a failed email into cancelling a completed sale.
  }
};
