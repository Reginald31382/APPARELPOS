import api from "../../../api/axios";

export const createPaymentIntent = async (amount) => {
  const { data } = await api.post("/payments/create-payment-intent", {
    amount,
  });

  return data;
};
