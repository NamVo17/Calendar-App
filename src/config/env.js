// Environment configuration object
export const ENV = {
  // API Base URL - lấy từ environment variable hoặc default localhost
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",

  // App Name - lấy từ environment variable hoặc default name
  APP_NAME: import.meta.env.VITE_APP_NAME || "Lovy-tech Calendar",

  // Node Environment - development, production, test
  NODE_ENV: import.meta.env.NODE_ENV || "development",

  // Storage Key - key để lưu data vào localStorage
  STORAGE_KEY: "lovy-tech-calendar",
}

// Helper constant để kiểm tra development environment
export const isDevelopment = ENV.NODE_ENV === "development"

// Helper constant để kiểm tra production environment
export const isProduction = ENV.NODE_ENV === "production"
