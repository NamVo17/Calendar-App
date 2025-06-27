export const userService = {
  async getUsers() {
    try {
      const savedData = localStorage.getItem("calendar-data")
      if (savedData) {
        const data = JSON.parse(savedData)
        return data.users.map((user) => ({
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          createdAt: user.createdAt,
        }))
      }

      const response = await fetch("/database.json")
      if (!response.ok) {
        throw new Error("Failed to load user data")
      }

      const data = await response.json()
      return data.users.map((user) => ({
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
      let data = { users: [], events: [] }

      const savedData = localStorage.getItem("calendar-data")
      if (savedData) {
        data = JSON.parse(savedData)
      } else {
        const response = await fetch("/database.json")
        if (response.ok) {
          data = await response.json()
        }
      }

      const newUser = {
        id: Math.max(0, ...data.users.map((u) => u.id)) + 1, 
        username: userData.username,
        email: userData.email,
        password: userData.password,
        fullName: userData.fullName,
        createdAt: new Date().toISOString().split("T")[0], 
      }

      data.users.push(newUser)
      localStorage.setItem("calendar-data", JSON.stringify(data))

      return {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        createdAt: newUser.createdAt,
      }
    } catch (error) {
      throw new Error(error.message || "Failed to create user")
    }
  },

  async updateUser(userData) {
    try {
      let data = { users: [], events: [] }

      const savedData = localStorage.getItem("calendar-data")
      if (savedData) {
        data = JSON.parse(savedData)
      } else {
        const response = await fetch("/database.json")
        if (response.ok) {
          data = await response.json()
        }
      }

      const userIndex = data.users.findIndex((u) => u.id === userData.id)
      if (userIndex === -1) {
        throw new Error("User not found")
      }

      const updatedUser = { ...data.users[userIndex], ...userData }
      data.users[userIndex] = updatedUser
      localStorage.setItem("calendar-data", JSON.stringify(data))

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
      let data = { users: [], events: [] }

      const savedData = localStorage.getItem("calendar-data")
      if (savedData) {
        data = JSON.parse(savedData)
      } else {
        const response = await fetch("/database.json")
        if (response.ok) {
          data = await response.json()
        }
      }

      data.users = data.users.filter((u) => u.id !== id)
      localStorage.setItem("calendar-data", JSON.stringify(data))
    } catch (error) {
      throw new Error(error.message || "Failed to delete user")
    }
  },
}
