import axios from "axios";

// Helper function để lấy dữ liệu users từ localStorage hoặc database.json
const getUsersData = async () => {
  try {
    // Kiểm tra localStorage trước
    const tempData = localStorage.getItem("temp-users");
    if (tempData) {
      const parsed = JSON.parse(tempData);
      return parsed.users;
    }
    // Nếu không có dữ liệu localStorage, lấy từ database.json
    const response = await axios.get("/database.json");
    return response.data.users || [];
  } catch (error) {
    console.error("Error getting users data:", error);
    return [];
  }
};

// Helper function để lưu dữ liệu vào localStorage
const saveUsersToLocalStorage = (users) => {
  localStorage.setItem("temp-users", JSON.stringify({ users }));
};

export const userService = {
  async getUsers() {
    try {
      const users = await getUsersData();
      return users.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        createdAt: user.createdAt,
      }));
    } catch (error) {
      throw new Error(error.message || "Failed to fetch users");
    }
  },

  async getUserById(id) {
    try {
      const users = await this.getUsers();
      const user = users.find((u) => u.id === id);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch user");
    }
  },

  async createUser(userData) {
    try {
      const users = await getUsersData();
      
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

      // Lưu vào localStorage
      const updatedUsers = [...users, newUser];
      saveUsersToLocalStorage(updatedUsers);

      return {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        createdAt: newUser.createdAt,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to create user");
    }
  },

  async updateUser(userData) {
    try {
      const users = await getUsersData();
      const userIndex = users.findIndex((u) => u.id === userData.id);
      
      if (userIndex === -1) {
        throw new Error("User not found");
      }

      // Cập nhật user
      const updatedUser = {
        ...users[userIndex],
        ...userData,
        updatedAt: new Date().toISOString(),
      };

      users[userIndex] = updatedUser;
      saveUsersToLocalStorage(users);

      return {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        createdAt: updatedUser.createdAt,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to update user");
    }
  },

  async deleteUser(id) {
    try {
      const users = await getUsersData();
      const filteredUsers = users.filter((u) => u.id !== id);
      
      if (filteredUsers.length === users.length) {
        throw new Error("User not found");
      }

      saveUsersToLocalStorage(filteredUsers);
    } catch (error) {
      throw new Error(error.message || "Failed to delete user");
    }
  },
}
