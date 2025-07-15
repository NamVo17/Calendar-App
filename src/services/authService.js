import axios from "axios";

export const authService = {
  async login(credentials) {
    try {
      const response = await axios.get("/database.json");
      const users = response.data.users || [];

      const user = users.find(
        (u) =>
          (u.username === credentials.username || u.email === credentials.username) &&
          u.password === credentials.password,
      );

      if (!user) {
        throw new Error("Invalid username/email or password");
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
      };
    } catch (error) {
      throw new Error(error.message || "Login failed");
    }
  },

  async register(userData) {
    try {
      // Lấy dữ liệu từ database.json
      const response = await axios.get("/database.json");
      const users = response.data.users || [];

      // Kiểm tra user đã tồn tại
      const existingUser = users.find((u) => u.username === userData.username || u.email === userData.email);
      if (existingUser) {
        throw new Error("Username or email already exists");
      }

      // Tạo user mới
      const newUser = {
        id: Math.max(0, ...users.map((u) => u.id)) + 1,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        fullName: userData.fullName,
        createdAt: new Date().toISOString().split("T")[0],
      };

      // Lưu vào localStorage không giới hạn thời gian
      localStorage.setItem("temp-users", JSON.stringify({ users: [...users, newUser] }));

      return {
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          fullName: newUser.fullName,
          createdAt: newUser.createdAt,
        },
        token: "mock-jwt-token",
      };
    } catch (error) {
      throw new Error(error.message || "Registration failed");
    }
  },

  async logout() {
    return Promise.resolve();
  },

  async refreshToken() {
    const currentUser = JSON.parse(localStorage.getItem("current-user") || "null");
    if (!currentUser) {
      throw new Error("No user found");
    }

    return {
      user: currentUser,
      token: "mock-jwt-token-refreshed",
    };
  },
}
