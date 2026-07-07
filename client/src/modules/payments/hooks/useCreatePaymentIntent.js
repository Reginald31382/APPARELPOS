import { useMutation } from "@tanstack/react-query";

import { createPaymentIntent } from "../services/stripeService";

const useCreatePaymentIntent = () => {
  return useMutation({
    mutationFn: createPaymentIntent,
  });
};

export default useCreatePaymentIntent;
