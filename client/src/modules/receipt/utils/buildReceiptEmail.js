import { formatCurrency } from "../../../utils/currency";

const buildReceiptEmail = (receipt, email) => {
  const items = receipt.items
    .map(
      (item) =>
        `${item.quantity} × ${item.name} (${item.color}/${item.size}) - ${formatCurrency(item.quantity * item.unitPrice)}`,
    )
    .join("\n");

  return {
    customer_email: email,

    receipt_number: receipt._id?.slice(-8),

    purchase_date: new Date(receipt.createdAt || Date.now()).toLocaleString(),
    customer_name:
      receipt.customer?.firstName && receipt.customer?.lastName
        ? `${receipt.customer.firstName} ${receipt.customer.lastName}`
        : "Walk-in Customer",

    items,

    subtotal: formatCurrency(receipt.subtotal),

    discount:
      receipt.discount?.amount > 0
        ? formatCurrency(receipt.discount.amount)
        : "$0.00",

    tax: formatCurrency(receipt.tax),

    total: formatCurrency(receipt.total),

    payment_method: receipt.paymentMethod,
  };
};

export default buildReceiptEmail;
