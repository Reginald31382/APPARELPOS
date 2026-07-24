import { create } from "zustand";

const token = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

const useAuthStore = create((set, get) => ({
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

  isAuthenticated: () => {
    return !!get().token;
  },

  hasRole: (...roles) => {
    return roles.includes(get().user?.role);
  },

  isAdmin: () => {
    return get().user?.role === "Admin";
  },

  isManager: () => {
    return get().user?.role === "Manager";
  },

  isEmployee: () => {
    return get().user?.role === "Employee";
  },
}));

export default useAuthStore;
