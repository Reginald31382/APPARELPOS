import buildOrder from "../utils/buildOrder";

export const buildCheckoutOrder = ({
  items,
  customer,
  subtotal,
  discount,
  discountType,
  discountReason,
  tax,
  total,
  paymentMethod,
}) => {
  return buildOrder({
    items,
    customer,
    subtotal,
    discount,
    discountType,
    discountReason,
    tax,
    total,
    paymentMethod,
  });
};
