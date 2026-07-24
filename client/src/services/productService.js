import api from "../api/axios";

export const fetchProducts = async (filters) => {
  const params = new URLSearchParams();

  if (filters.search) params.append("search", filters.search);
  if (filters.category) params.append("category", filters.category);
  if (filters.brand) params.append("brand", filters.brand);
  if (filters.featured) params.append("featured", true);
  if (filters.sort) params.append("sort", filters.sort);

  const { data } = await api.get(`/products?${params.toString()}`);

  return data;
};

export const fetchProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};
