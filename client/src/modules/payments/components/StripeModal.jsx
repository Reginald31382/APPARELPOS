import StripeCheckout from "./StripeCheckout";

const StripeModal = ({ total }) => {
  return <StripeCheckout total={total} />;
};

export default StripeModal;
