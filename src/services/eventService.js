// Service object chứa tất cả event-related API calls
export const eventService = {
  // Async function để lấy events của một user cụ thể
  async getEvents(userId) {
    try {
      // Khởi tạo data structure mặc định
      let data = { users: [], events: [] }

      // Cố gắng lấy từ localStorage trước, sau đó fallback về database.json
      const savedData = localStorage.getItem("calendar-data")
      if (savedData) {
        data = JSON.parse(savedData)
      } else {
        // Nếu không có trong localStorage, fetch từ database.json
        const response = await fetch("/database.json")
        if (response.ok) {
          data = await response.json()
          // Lưu vào localStorage để sử dụng cho lần sau
          localStorage.setItem("calendar-data", JSON.stringify(data))
        }
      }

      // Filter events theo user_id và return
      return data.events.filter((event) => event.user_id === userId)
    } catch (error) {
      throw new Error(error.message || "Failed to fetch events")
    }
  },

  // Async function để lấy tất cả events (không filter theo user)
  async getAllEvents() {
    try {
      let data = { users: [], events: [] }

      const savedData = localStorage.getItem("calendar-data")
      if (savedData) {
        data = JSON.parse(savedData)
      } else {
        const response = await fetch("/database.json")
        if (response.ok) {
          data = await response.json()
          localStorage.setItem("calendar-data", JSON.stringify(data))
        }
      }

      // Return tất cả events
      return data.events
    } catch (error) {
      throw new Error(error.message || "Failed to fetch events")
    }
  },

  // Async function để lấy event theo ID
  async getEventById(id) {
    try {
      // Sử dụng getAllEvents() để lấy tất cả events, sau đó tìm theo ID
      const events = await this.getAllEvents()
      const event = events.find((e) => e.id === id)
      if (!event) {
        throw new Error("Event not found")
      }
      return event
    } catch (error) {
      throw new Error(error.message || "Failed to fetch event")
    }
  },

  // Async function để tạo event mới
  async createEvent(eventData) {
    try {
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

      // Lấy current user từ localStorage
      const currentUser = JSON.parse(localStorage.getItem("current-user") || "null")

      // Tạo event object mới
      const newEvent = {
        id: Math.max(0, ...data.events.map((e) => e.id)) + 1, // Generate ID mới
        ...eventData, // Spread tất cả properties từ eventData
        user_id: currentUser?.id || 1, // Set user_id từ current user hoặc default = 1
        createdAt: new Date().toISOString(), // Timestamp tạo event
        updatedAt: new Date().toISOString(), // Timestamp update event
      }

      // Thêm event mới vào array
      data.events.push(newEvent)
      // Lưu lại vào localStorage
      localStorage.setItem("calendar-data", JSON.stringify(data))

      return newEvent
    } catch (error) {
      throw new Error(error.message || "Failed to create event")
    }
  },

  // Async function để update event
  async updateEvent(eventData) {
    try {
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

      // Tìm index của event cần update
      const eventIndex = data.events.findIndex((e) => e.id === eventData.id)
      if (eventIndex === -1) {
        throw new Error("Event not found")
      }

      // Merge dữ liệu cũ với dữ liệu mới và update timestamp
      const updatedEvent = {
        ...data.events[eventIndex], // Dữ liệu cũ
        ...eventData, // Dữ liệu mới (override)
        updatedAt: new Date().toISOString(), // Update timestamp
      }
      // Cập nhật event trong array
      data.events[eventIndex] = updatedEvent
      // Lưu lại vào localStorage
      localStorage.setItem("calendar-data", JSON.stringify(data))

      return updatedEvent
    } catch (error) {
      throw new Error(error.message || "Failed to update event")
    }
  },

  // Async function để xóa event
  async deleteEvent(id) {
    try {
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

      // Filter bỏ event có ID cần xóa
      data.events = data.events.filter((e) => e.id !== id)
      // Lưu lại vào localStorage
      localStorage.setItem("calendar-data", JSON.stringify(data))
    } catch (error) {
      throw new Error(error.message || "Failed to delete event")
    }
  },
}
