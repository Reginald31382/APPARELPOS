import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import useProductStore from "../../store/useProductStore";

const fetchProducts = async (filters) => {
  const params = new URLSearchParams();

  if (filters.search) {
    params.append("search", filters.search);
  }

  if (filters.category) {
    params.append("category", filters.category);
  }

  if (filters.brand) {
    params.append("brand", filters.brand);
  }

  if (filters.featured) {
    params.append("featured", true);
  }

  if (filters.sort) {
    params.append("sort", filters.sort);
  }

  const res = await api.get(`/products?${params.toString()}`);

  return res.data;
};

const useProducts = () => {
  const { search, category, brand, featured, sort } = useProductStore();

  return useQuery({
    queryKey: ["products", search, category, brand, featured, sort],

    queryFn: () =>
      fetchProducts({
        search,
        category,
        brand,
        featured,
        sort,
      }),

    placeholderData: (previousData) => previousData,
  });
};

export default useProducts;
