import api from "../../../api/axios";

export const fetchDashboard = async () => {
  const { data } = await api.get("/dashboard");

  return data;
};
