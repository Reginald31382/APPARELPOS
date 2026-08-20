import { useQuery } from "@tanstack/react-query";

import useProductStore from "../store/product/useProductStore";
import useDebounce from "../hooks/useDebounce";

import { fetchProducts } from "../services/productService.js";

import { QUERY_KEYS } from "../constants/queryKeys";

const useProducts = (overrideFilters = {}) => {
  const store = useProductStore();

  const { search, category, gender, brand, featured, sort } = {
    ...store,
    ...overrideFilters,
  };

  const debouncedSearch = useDebounce(search, 300);

  return useQuery({
    queryKey: [
      QUERY_KEYS.PRODUCTS,
      search,
      category,
      gender,
      brand,
      featured,
      sort,
    ],

    queryFn: () =>
      fetchProducts({
        search: debouncedSearch,
        category,
        gender,
        brand,
        featured,
        sort,
      }),
  });
};

export default useProducts;
