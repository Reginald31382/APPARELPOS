const buildOrder = ({
  items,
  customer,
  subtotal,
  discount = 0,
  discountType = "Amount",
  discountReason = "",
  tax,
  total,
  paymentMethod,
  orderType = "POS",
}) => {
  return {
    customer: customer?._id || null,

    items,

    subtotal,

    discount,

    discountType,

    discountReason,

    tax,

    total,

    paymentMethod,

    orderType,

    status: "Pending",
  };
};

export default buildOrder;
