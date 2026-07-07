import api from "../api/axios";

export const fetchCustomers = async (search = "") => {
  const { data } = await api.get("/customers", {
    params: {
      search,
    },
  });

  return data;
};
