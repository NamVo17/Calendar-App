import { apiClient } from "@/config/axios"

export const authService = {
  async login(credentials) {
    try {
      const response = await apiClient.get("/users")
      const users = response.data || [] 

      const user = users.find(
        (u) =>
          (u.username === credentials.username || u.email === credentials.username) &&
          u.password === credentials.password,
      )

      if (!user) {
        throw new Error("Invalid username/email or password")
      }

      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          createdAt: user.createdAt,
        },
        token: "mock-jwt-token", 
      }
    } catch (error) {
      throw new Error(error.message || "Login failed")
    }
  },

  async register(userData) {
    try {
      const response = await apiClient.get("/users")
      const users = response.data || []

      const existingUser = users.find((u) => u.username === userData.username || u.email === userData.email)

      if (existingUser) {
        throw new Error("Username or email already exists")
      }

      const newUser = {
        id: Math.max(0, ...users.map((u) => u.id)) + 1, // Generate ID mới
        username: userData.username,
        email: userData.email,
        password: userData.password,
        fullName: userData.fullName,
        createdAt: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
      }

      // Tạo user mới trên server
      const createResponse = await apiClient.post("/users", newUser)
      // Không cần kiểm tra createResponse.ok với axios

      return {
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          fullName: newUser.fullName,
          createdAt: newUser.createdAt,
        },
        token: "mock-jwt-token", 
      }
    } catch (error) {
      throw new Error(error.message || "Registration failed")
    }
  },

  async logout() {
    return Promise.resolve()
  },

  async refreshToken() {
    const currentUser = JSON.parse(localStorage.getItem("current-user") || "null")
    if (!currentUser) {
      throw new Error("No user found")
    }

    return {
      user: currentUser,
      token: "mock-jwt-token-refreshed", 
    }
  },
}
