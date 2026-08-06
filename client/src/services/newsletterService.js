import api from "../api/axios";

export const subscribeNewsletter = async (email) => {
  const { data } = await api.post("/newsletter", {
    email,
  });

  return data;
};
