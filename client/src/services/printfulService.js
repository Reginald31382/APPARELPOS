import api from "../api/axios";

export const fetchPrintfulProducts = async () => {
  const { data } = await api.get("/printful/products");
  return data.products;
};
