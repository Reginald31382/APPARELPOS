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

    status: "Pending",
  };
};

export default buildOrder;
