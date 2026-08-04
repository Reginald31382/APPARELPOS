const isDev = process.env.NODE_ENV !== "production";

export const logger = {
  info(...args) {
    if (isDev) {
      console.log("ℹ️", ...args);
    }
  },

  success(...args) {
    if (isDev) {
      console.log("✅", ...args);
    }
  },

  warn(...args) {
    console.warn("⚠️", ...args);
  },

  error(...args) {
    console.error("❌", ...args);
  },
};
