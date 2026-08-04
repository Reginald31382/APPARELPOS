import Receipt from "../models/Receipt.js";
import generateReceiptNumber from "../utils/generateReceiptNumber.js";

export async function createReceipt(order, session) {
  const [receipt] = await Receipt.create(
    [
      {
        receiptNumber: await generateReceiptNumber(),

        order: order._id,

        customerEmail: order.customerEmail,

        orderType: order.orderType,

        subtotal: order.subtotal,

        tax: order.tax,

        shipping: order.shipping?.cost || 0,

        discount: order.discount,

        total: order.total,

        paymentMethod: order.paymentMethod,

        paymentStatus: order.paymentStatus,

        items: order.items.map((item) => ({
          name: item.name,
          sku: item.sku,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      },
    ],
    { session },
  );

  return receipt;
}
