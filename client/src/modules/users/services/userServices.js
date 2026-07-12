import api from "../../../api/axios";

export const getUsers = async () => {
  const { data } = await api.get("/users");

  return data;
};
