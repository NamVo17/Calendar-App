import axios from "axios";

// Helper function để lấy dữ liệu events từ localStorage hoặc database.json
const getEventsData = async () => {
  try {
    // Kiểm tra localStorage trước
    const tempData = localStorage.getItem("temp-events");
    if (tempData) {
      const parsed = JSON.parse(tempData);
      return parsed.events;
    }
    // Nếu không có dữ liệu localStorage, lấy từ database.json
    const response = await axios.get("/database.json");
    return response.data.events || [];
  } catch (error) {
    console.error("Error getting events data:", error);
    return [];
  }
};

// Helper function để lưu dữ liệu vào localStorage
const saveEventsToLocalStorage = (events) => {
  localStorage.setItem("temp-events", JSON.stringify({ events }));
};

export const eventService = {
  async getEvents(userId) {
    try {
      const events = await getEventsData();
      // Lọc theo userId nếu có
      if (userId) {
        return events.filter((e) => e.user_id === userId);
      }
      return events;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch events");
    }
  },

  async getAllEvents() {
    try {
      return await getEventsData();
    } catch (error) {
      throw new Error(error.message || "Failed to fetch events");
    }
  },

  async getEventById(id) {
    try {
      const events = await this.getAllEvents();
      const event = events.find((e) => e.id === id);
      if (!event) {
        throw new Error("Event not found");
      }
      return event;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch event");
    }
  },

  async createEvent(eventData) {
    try {
      const events = await getEventsData();
      const currentUser = JSON.parse(localStorage.getItem("current-user") || "null");

      const newEvent = {
        id: Math.max(0, ...events.map((e) => e.id)) + 1,
        ...eventData,
        user_id: currentUser?.id || 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Lưu vào localStorage
      const updatedEvents = [...events, newEvent];
      saveEventsToLocalStorage(updatedEvents);

      return newEvent;
    } catch (error) {
      throw new Error(error.message || "Failed to create event");
    }
  },

  async updateEvent(eventData) {
    try {
      const events = await getEventsData();
      const eventIndex = events.findIndex((e) => e.id === eventData.id);
      
      if (eventIndex === -1) {
        throw new Error("Event not found");
      }

      // Cập nhật event
      const updatedEvent = {
        ...events[eventIndex],
        ...eventData,
        updatedAt: new Date().toISOString(),
      };

      events[eventIndex] = updatedEvent;
      saveEventsToLocalStorage(events);

      return updatedEvent;
    } catch (error) {
      throw new Error(error.message || "Failed to update event");
    }
  },

  async deleteEvent(id) {
    try {
      const events = await getEventsData();
      const filteredEvents = events.filter((e) => e.id !== id);
      
      if (filteredEvents.length === events.length) {
        throw new Error("Event not found");
      }

      saveEventsToLocalStorage(filteredEvents);
    } catch (error) {
      throw new Error(error.message || "Failed to delete event");
    }
  },
}
