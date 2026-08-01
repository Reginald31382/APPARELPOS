import axios from "axios";

export const sendShipmentEmail = async (order) => {
  if (!order.customerEmail) {
    console.log("Shipment email skipped (no customer email).");
    return;
  }

  const trackingLink =
    order.shipping.trackingUrl ||
    `https://tools.usps.com/go/TrackConfirmAction?tLabels=${order.shipping.trackingNumber}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
      <h2>Your order has shipped! 📦</h2>

      <p>
        Hello ${order.shippingAddress?.firstName || "Customer"},
      </p>

      <p>
        Great news! Your J.Rome Apparel order
        <strong>${order.orderNumber}</strong>
        has shipped.
      </p>

      <hr>

      <p><strong>Carrier:</strong> ${order.shipping.carrier}</p>

      <p><strong>Service:</strong> ${order.shipping.service}</p>

      <p>
        <strong>Tracking Number:</strong>
        ${order.shipping.trackingNumber}
      </p>

      <p style="margin:30px 0;">
        <a
          href="${trackingLink}"
          style="
            background:#000;
            color:#fff;
            text-decoration:none;
            padding:12px 20px;
            border-radius:6px;
            display:inline-block;
          "
        >
          Track Your Package
        </a>
      </p>

      <p>
        Thank you for shopping with J.Rome Apparel!
      </p>
    </div>
  `;

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

        subject: `Your J.Rome Apparel Order ${order.orderNumber} Has Shipped`,

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

    console.log(`📦 Shipment email sent to ${order.customerEmail}`);
  } catch (error) {
    console.error("Brevo Shipment Email Error:");
    console.error(error.response?.data || error.message);

    // Don't throw.
    // We don't want a failed email to stop the shipping process.
  }
};
