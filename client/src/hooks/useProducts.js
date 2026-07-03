import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

const fetchProducts = async (filters) => {
  const params = new URLSearchParams(filters).toString();

  const res = await api.get(`/products?${params}`);

  return res.data;
};

const useProducts = (filters = {}) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(filters),
    keepPreviousData: true,
  });
};

export default useProducts;
