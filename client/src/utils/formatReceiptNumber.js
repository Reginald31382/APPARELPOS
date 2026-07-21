const formatReceiptNumber = (order) => {
  if (!order) return "JR-UNKNOWN";

  const date = new Date(order.createdAt || Date.now());

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  // Use the last 6 hex characters of the MongoDB id
  const sequence = (order._id || "").slice(-6).toUpperCase();

  return `JR-${year}${month}${day}-${sequence}`;
};

export default formatReceiptNumber;
