// Service object chứa tất cả authentication-related API calls
export const authService = {
  // Async function để xử lý login
  async login(credentials) {
    try {
      // Fetch dữ liệu từ file database.json trong public folder
      const response = await fetch("/database.json")
      if (!response.ok) {
        throw new Error("Failed to load user data")
      }

      // Parse JSON data từ response
      const data = await response.json()
      const users = data.users || [] // Lấy array users, fallback về empty array

      // Tìm user matching với credentials
      const user = users.find(
        (u) =>
          // Check username hoặc email match với input
          (u.username === credentials.username || u.email === credentials.username) &&
          // Check password match
          u.password === credentials.password,
      )

      // Nếu không tìm thấy user matching
      if (!user) {
        throw new Error("Invalid username/email or password")
      }

      // Return user data và mock token
      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          createdAt: user.createdAt,
        },
        token: "mock-jwt-token", // Mock JWT token
      }
    } catch (error) {
      // Re-throw error với message
      throw new Error(error.message || "Login failed")
    }
  },

  // Async function để xử lý registration
  async register(userData) {
    try {
      // Fetch existing data từ database.json
      const response = await fetch("/database.json")
      if (!response.ok) {
        throw new Error("Failed to load user data")
      }

      const data = await response.json()
      const users = data.users || []

      // Check xem username hoặc email đã tồn tại chưa
      const existingUser = users.find((u) => u.username === userData.username || u.email === userData.email)

      if (existingUser) {
        throw new Error("Username or email already exists")
      }

      // Tạo user object mới
      const newUser = {
        id: Math.max(0, ...users.map((u) => u.id)) + 1, // Generate ID mới
        username: userData.username,
        email: userData.email,
        password: userData.password,
        fullName: userData.fullName,
        createdAt: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
      }

      // Lưu vào localStorage vì không thể write file JSON trong browser
      const savedData = JSON.parse(localStorage.getItem("calendar-data") || JSON.stringify(data))
      savedData.users.push(newUser)
      localStorage.setItem("calendar-data", JSON.stringify(savedData))

      // Return user data và mock token
      return {
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          fullName: newUser.fullName,
          createdAt: newUser.createdAt,
        },
        token: "mock-jwt-token", // Mock JWT token
      }
    } catch (error) {
      // Re-throw error với message
      throw new Error(error.message || "Registration failed")
    }
  },

  // Async function để xử lý logout
  async logout() {
    // Mock implementation - trong thực tế sẽ gọi API để invalidate token
    return Promise.resolve()
  },

  // Async function để refresh token
  async refreshToken() {
    // Mock implementation - trong thực tế sẽ gọi API để refresh token
    const currentUser = JSON.parse(localStorage.getItem("current-user") || "null")
    if (!currentUser) {
      throw new Error("No user found")
    }

    return {
      user: currentUser,
      token: "mock-jwt-token-refreshed", // Mock refreshed token
    }
  },
}
