import buildOrder from "../utils/buildOrder";

export const buildCheckoutOrder = ({
  items,
  customer,
  subtotal,
  tax,
  total,
  paymentMethod,
}) => {
  return buildOrder({
    items,
    customer,
    subtotal,
    tax,
    total,
    paymentMethod,
  });
};
