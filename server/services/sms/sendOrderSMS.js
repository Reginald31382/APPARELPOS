import twilio from "twilio";
import Store from "../../models/Store.js";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

export async function sendOrderSMS(order) {
  const store = await Store.findOne();

  if (!store?.smsNotifications?.enabled || !store.smsNotifications.phone) {
    return;
  }

  const body = `
🛍 New Order!

${order.orderNumber}

Customer:
${order.customerEmail}

Total:
$${order.total.toFixed(2)}
`;

  await client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to: store.smsNotifications.phone,
    body,
  });

  console.log("📱 SMS Sent");
}
