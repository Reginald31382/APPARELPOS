import { useMutation } from "@tanstack/react-query";
import { createOrder } from "../services/orderService";

const useCheckout = () =>
  useMutation({
    mutationFn: createOrder,
  });

export default useCheckout;
