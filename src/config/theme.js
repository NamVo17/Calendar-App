// Ant Design theme configuration object
export const antdTheme = {
  // Token configuration - override default Ant Design design tokens
  token: {
    colorPrimary: "#3b82f6", // Primary color (blue)
    colorSuccess: "#10b981", // Success color (green)
    colorWarning: "#f59e0b", // Warning color (yellow)
    colorError: "#ef4444", // Error color (red)
    colorInfo: "#06b6d4", // Info color (cyan)
    borderRadius: 8, // Default border radius (8px)
    fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif", // Font stack
  },

  // Component-specific configurations
  components: {
    // Button component customization
    Button: {
      borderRadius: 8, // Button border radius
      controlHeight: 40, // Button height
    },
    // Input component customization
    Input: {
      borderRadius: 8, // Input border radius
      controlHeight: 40, // Input height
    },
    // Modal component customization
    Modal: {
      borderRadius: 12, // Modal border radius
    },
    // Card component customization
    Card: {
      borderRadius: 12, // Card border radius
    },
  },
}

// Custom colors object để sử dụng trong SCSS và components
export const colors = {
  // Primary colors
  primary: "#3b82f6",
  secondary: "#6b7280",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#06b6d4",

  // Basic colors
  white: "#ffffff",
  black: "#000000",

  // Gray scale palette
  gray: {
    50: "#f9fafb", // Lightest gray
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280", // Medium gray
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827", // Darkest gray
  },
}
