import api from "../../../api/axios";

export const login = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  return data;
};

export const register = async (user) => {
  const { data } = await api.post("/auth/register", user);
  return data;
};
