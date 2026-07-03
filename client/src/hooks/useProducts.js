import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

const fetchProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};

export default useProducts;
