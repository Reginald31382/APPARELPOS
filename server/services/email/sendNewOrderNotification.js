import axios from "axios";

export const sendNewOrderNotification = async (order) => {
  const htmlContent = `
    <h2>🛍 New Order Received</h2>

    <p><strong>Order:</strong> ${order.orderNumber}</p>

    <p><strong>Customer:</strong> ${order.customerEmail || "Walk-In Customer"}</p>

    <p><strong>Order Type:</strong> ${order.orderType}</p>

    <p><strong>Payment:</strong> ${order.paymentMethod}</p>

    <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>

    <hr>

    <h3>Items</h3>

    <ul>
      ${order.items
        .map(
          (item) => `
            <li>
              ${item.quantity} × ${item.name}
              ${item.color ? `(${item.color}` : ""}
              ${item.size ? ` / ${item.size})` : ""}
            </li>
          `,
        )
        .join("")}
    </ul>
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
            email: process.env.ADMIN_ORDER_EMAIL,
            name: "Store Owner",
          },
        ],

        subject: `🛍 New Order ${order.orderNumber}`,

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

    console.log("📧 Admin order notification sent");
  } catch (error) {
    console.error("Brevo Admin Notification Error:");

    console.error(error.response?.data || error.message);
  }
};
