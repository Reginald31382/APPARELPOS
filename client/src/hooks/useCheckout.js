import { useMutation } from "@tanstack/react-query";
import { createOrder } from "../services/checkoutServices.js";

const useCheckout = () =>
  useMutation({
    mutationFn: createOrder,
  });

export default useCheckout;
