import api from "../../../api/axios";

export const getUsers = async () => {
  const { data } = await api.get("/users");

  return data;
};

export const createUser = async (user) => {
  const { data } = await api.post("/users", user);

  return data;
};
