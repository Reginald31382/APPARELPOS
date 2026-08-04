import api from "../../../api/axios";

export const fetchReceipts = async () => {
  const { data } = await api.get("/receipts");

  return data;
};

export const fetchReceipt = async (id) => {
  const { data } = await api.get(`/receipts/${id}`);

  return data;
};
