import api from "../../../api/axios";

export const getReportSummary = async (params = {}) => {
  const { data } = await api.get("/reports/summary", {
    params,
  });

  return data;
};

export const getSalesReport = async (params = {}) => {
  const { data } = await api.get("/reports/sales", {
    params,
  });

  return data;
};

export const getOrdersReport = async (params = {}) => {
  const { data } = await api.get("/reports/orders", {
    params,
  });

  return data;
};

export const getProductsReport = async (params = {}) => {
  const { data } = await api.get("/reports/products", {
    params,
  });

  return data;
};

export const getInventoryReport = async (params = {}) => {
  const { data } = await api.get("/reports/inventory", {
    params,
  });

  return data;
};
