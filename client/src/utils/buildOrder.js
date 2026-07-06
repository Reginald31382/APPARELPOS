const buildOrder = ({
  items,
  customer,
  subtotal,
  tax,
  total,
  paymentMethod,
}) => {
  return {
    customer: customer?._id || null,

    items,

    subtotal,

    tax,

    total,

    paymentMethod,

    status: "Pending",
  };
};

export default buildOrder;
