import { useQuery } from "@tanstack/react-query";

import useProductStore from "../store/product/useProductStore";
import useDebounce from "../hooks/useDebounce";

import { fetchProducts } from "../services/productService.js";

import { QUERY_KEYS } from "../constants/queryKeys";

const useProducts = () => {
  const { search, category, brand, featured, sort } = useProductStore();

  const debouncedSearch = useDebounce(search, 300);

  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, search, category, brand, featured, sort],

    queryFn: () =>
      fetchProducts({
        search: debouncedSearch,
        category,
        brand,
        featured,
        sort,
      }),

    placeholderData: (previous) => previous,
  });
};

export default useProducts;
