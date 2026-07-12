import api from "../../../api/axios";

export const getSettings = async () => {
  const { data } = await api.get("/settings");
  return data;
};

export const updateSettings = async (settings, token) => {
  const { data } = await api.put("/settings", settings, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};
