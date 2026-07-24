import api from "../api/axios";

export const managerOverride = async (credentials) => {
  const { data } = await api.post("/auth/override", credentials);

  return data;
};
