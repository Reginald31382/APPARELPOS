import { create } from "zustand";

const token = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

const useAuthStore = create((set) => ({
  token,
  user: storedUser ? JSON.parse(storedUser) : null,

  login: ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    set({
      token,
      user,
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({
      token: null,
      user: null,
    });
  },
}));

export default useAuthStore;
