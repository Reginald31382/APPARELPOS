import api from "../../../api/axios";

export const hasUsers = async () => {
  const { data } = await api.get("/auth/has-users");
  return data;
};
