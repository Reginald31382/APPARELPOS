import api from "../api/axios";

// Retrieve Printify products and their ApparelPOS import status.
export const fetchPrintifyProducts = async () => {
  const { data } = await api.get("/printify/products");
  return data.products;
};

// Test the connection to your Printify account.
export const testPrintifyConnection = async () => {
  const { data } = await api.get("/printify/test-connection");
  return data;
};

// Import a Printify product into ApparelPOS.
export const importPrintifyProduct = async (id) => {
  const { data } = await api.post(`/printify/products/${id}/import`);
  return data;
};

export const fetchPrintifyProductStatus = async (id) => {
  const { data } = await api.get(`/printify/products/${id}/status`);
  return data;
};
