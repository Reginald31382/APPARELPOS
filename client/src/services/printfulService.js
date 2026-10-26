import api from "../api/axios";

export const fetchPrintfulProducts = async () => {
  const { data } = await api.get("/printful/products");
  return data.products;
};

export const fetchPrintfulProductDetails = async (id) => {
  const { data } = await api.get(`/printful/products/${id}/details`);
  return data.details;
};

export const importPrintfulProduct = async (id) => {
  const { data } = await api.post(`/printful/products/${id}/import`);
  return data;
};

export const deleteImportedPrintfulProduct = async (id) => {
  const { data } = await api.delete(`/printful/products/${id}/import`);
  return data;
};
