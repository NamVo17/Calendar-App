export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",

  APP_NAME: import.meta.env.VITE_APP_NAME || "Lovy-tech Calendar",

  NODE_ENV: import.meta.env.NODE_ENV || "development",

  STORAGE_KEY: "lovy-tech-calendar",
}

export const isDevelopment = ENV.NODE_ENV === "development"

export const isProduction = ENV.NODE_ENV === "production"
