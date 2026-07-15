import api from "../../../api/axios";

export const getUsers = async () => {
  const { data } = await api.get("/users");

  return data;
};

export const createUser = async (user) => {
  const { data } = await api.post("/users", user);

  return data;
};

export const updateUser = async ({ id, ...user }) => {
  const { data } = await api.put(`/users/${id}`, user);

  return data;
};

export const resetPassword = async ({ id, password }) => {
  const { data } = await api.put(`/users/${id}/password`, {
    password,
  });

  return data;
};
