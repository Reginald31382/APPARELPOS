import twilio from "twilio";
import Store from "../../models/Store.js";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

export async function sendOrderSMS(order) {
  // console.log("📱 sendOrderSMS() called");

  const store = await Store.findOne();

  // console.log("SMS Settings:");
  console.dir(store.smsNotifications, { depth: null });

  if (!store?.smsNotifications?.enabled) {
    // console.log("❌ SMS notifications are disabled.");
    return;
  }

  if (!store.smsNotifications.phone) {
    // console.log("❌ No destination phone number configured.");
    return;
  }

  const body = `🛍 New Order!

${order.orderNumber}

Customer:
${order.customerEmail}

Total:
$${order.total.toFixed(2)}
`;

  // console.log("Sending SMS to:", store.smsNotifications.phone);

  const message = await client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to: store.smsNotifications.phone,
    body,
  });

  return message;
}
