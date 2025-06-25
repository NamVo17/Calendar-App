// Service object chứa tất cả user-related API calls
export const userService = {
  // Async function để lấy danh sách tất cả users
  async getUsers() {
    try {
      // Cố gắng lấy dữ liệu từ localStorage trước, sau đó fallback về database.json
      const savedData = localStorage.getItem("calendar-data")
      if (savedData) {
        // Nếu có dữ liệu trong localStorage, parse và return
        const data = JSON.parse(savedData)
        return data.users.map((user) => ({
          // Map qua từng user và chỉ return những field cần thiết (loại bỏ password)
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          createdAt: user.createdAt,
        }))
      }

      // Fallback: nếu không có trong localStorage, fetch từ database.json
      const response = await fetch("/database.json")
      if (!response.ok) {
        throw new Error("Failed to load user data")
      }

      const data = await response.json()
      // Return danh sách users đã được sanitized (không có password)
      return data.users.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        createdAt: user.createdAt,
      }))
    } catch (error) {
      // Re-throw error với message tùy chỉnh
      throw new Error(error.message || "Failed to fetch users")
    }
  },

  // Async function để lấy user theo ID
  async getUserById(id) {
    try {
      // Sử dụng getUsers() để lấy tất cả users, sau đó filter theo ID
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

  // Async function để tạo user mới
  async createUser(userData) {
    try {
      // Khởi tạo data structure mặc định
      let data = { users: [], events: [] }

      // Kiểm tra localStorage trước
      const savedData = localStorage.getItem("calendar-data")
      if (savedData) {
        // Nếu có dữ liệu trong localStorage, sử dụng nó
        data = JSON.parse(savedData)
      } else {
        // Nếu không có, fetch từ database.json
        const response = await fetch("/database.json")
        if (response.ok) {
          data = await response.json()
        }
      }

      // Tạo user object mới với ID được generate tự động
      const newUser = {
        id: Math.max(0, ...data.users.map((u) => u.id)) + 1, // Tìm ID lớn nhất và +1
        username: userData.username,
        email: userData.email,
        password: userData.password,
        fullName: userData.fullName,
        createdAt: new Date().toISOString().split("T")[0], // Format: YYYY-MM-DD
      }

      // Thêm user mới vào array
      data.users.push(newUser)
      // Lưu lại vào localStorage
      localStorage.setItem("calendar-data", JSON.stringify(data))

      // Return user data (không có password)
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

  // Async function để update user
  async updateUser(userData) {
    try {
      // Khởi tạo data structure mặc định
      let data = { users: [], events: [] }

      // Lấy dữ liệu hiện tại từ localStorage hoặc database.json
      const savedData = localStorage.getItem("calendar-data")
      if (savedData) {
        data = JSON.parse(savedData)
      } else {
        const response = await fetch("/database.json")
        if (response.ok) {
          data = await response.json()
        }
      }

      // Tìm index của user cần update
      const userIndex = data.users.findIndex((u) => u.id === userData.id)
      if (userIndex === -1) {
        throw new Error("User not found")
      }

      // Merge dữ liệu cũ với dữ liệu mới
      const updatedUser = { ...data.users[userIndex], ...userData }
      // Cập nhật user trong array
      data.users[userIndex] = updatedUser
      // Lưu lại vào localStorage
      localStorage.setItem("calendar-data", JSON.stringify(data))

      // Return user data đã được update (không có password)
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

  // Async function để xóa user
  async deleteUser(id) {
    try {
      // Khởi tạo data structure mặc định
      let data = { users: [], events: [] }

      // Lấy dữ liệu hiện tại
      const savedData = localStorage.getItem("calendar-data")
      if (savedData) {
        data = JSON.parse(savedData)
      } else {
        const response = await fetch("/database.json")
        if (response.ok) {
          data = await response.json()
        }
      }

      // Filter bỏ user có ID cần xóa
      data.users = data.users.filter((u) => u.id !== id)
      // Lưu lại vào localStorage
      localStorage.setItem("calendar-data", JSON.stringify(data))
    } catch (error) {
      throw new Error(error.message || "Failed to delete user")
    }
  },
}
