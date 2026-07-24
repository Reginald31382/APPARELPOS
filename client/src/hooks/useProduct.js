import { useQuery } from "@tanstack/react-query";

import { fetchProductById } from "../services/productService";
import { QUERY_KEYS } from "../constants/queryKeys";

const useProduct = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });
};

export default useProduct;
