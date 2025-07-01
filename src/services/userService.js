import { apiClient } from "@/config/axios"

export const userService = {
  async getUsers() {
    try {
      const response = await apiClient.get("/users")
      if (!response.ok) {
        throw new Error("Failed to load user data")
      }

      const users = response.data || []
      return users.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        createdAt: user.createdAt,
      }))
    } catch (error) {
      throw new Error(error.message || "Failed to fetch users")
    }
  },

  async getUserById(id) {
    try {
      const users = await this.getUsers()
      const user = users.find((u) => u.id === id)
      if (!user) {
        throw new Error("User not found")
      }
      return user
    } catch (error) {
      throw new Error(error.message || "Failed to fetch user")
    }
  },

  async createUser(userData) {
    try {
      const newUser = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        fullName: userData.fullName,
        createdAt: new Date().toISOString().split("T")[0], 
      }

      const response = await apiClient.post("/users", newUser)
      if (!response.ok) {
        throw new Error("Failed to create user")
      }

      const createdUser = response.data
      return {
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
        fullName: createdUser.fullName,
        createdAt: createdUser.createdAt,
      }
    } catch (error) {
      throw new Error(error.message || "Failed to create user")
    }
  },

  async updateUser(userData) {
    try {
      const response = await apiClient.put(`/users/${userData.id}`, userData)
      if (!response.ok) {
        throw new Error("Failed to update user")
      }

      const updatedUser = response.data
      return {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        createdAt: updatedUser.createdAt,
      }
    } catch (error) {
      throw new Error(error.message || "Failed to update user")
    }
  },

  async deleteUser(id) {
    try {
      const response = await apiClient.delete(`/users/${id}`)
      if (!response.ok) {
        throw new Error("Failed to delete user")
      }
    } catch (error) {
      throw new Error(error.message || "Failed to delete user")
    }
  },
}
