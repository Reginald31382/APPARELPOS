import api from "../../../api/axios";

export const getInventory = async () => {
  const { data } = await api.get("/products");

  return data;
};

export const updateInventory = async ({ sku, quantity, reason, notes }) => {
  const { data } = await api.put("/inventory", {
    sku,
    quantity,
    reason,
    notes,
  });

  return data;
};
