import { apiClient } from "@/config/axios"

export const eventService = {
  async getEvents(userId) {
    try {
      const response = await apiClient.get(`/events?user_id=${userId}`)
      return response.data || []
    } catch (error) {
      throw new Error(error.message || "Failed to fetch events")
    }
  },

  async getAllEvents() {
    try {
      const response = await apiClient.get("/events")
      return response.data || []
    } catch (error) {
      throw new Error(error.message || "Failed to fetch events")
    }
  },

  async getEventById(id) {
    try {
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

  async createEvent(eventData) {
    try {
      const currentUser = JSON.parse(localStorage.getItem("current-user") || "null")

      const newEvent = {
        ...eventData, 
        user_id: currentUser?.id || 1, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString(), 
      }

      const response = await apiClient.post("/events", newEvent)
      return response.data
    } catch (error) {
      throw new Error(error.message || "Failed to create event")
    }
  },

  async updateEvent(eventData) {
    try {
      const updatedEvent = {
        ...eventData, 
        updatedAt: new Date().toISOString(), 
      }

      const response = await apiClient.put(`/events/${eventData.id}`, updatedEvent)
      return response.data
    } catch (error) {
      throw new Error(error.message || "Failed to update event")
    }
  },

  async deleteEvent(id) {
    try {
      await apiClient.delete(`/events/${id}`)
    } catch (error) {
      throw new Error(error.message || "Failed to delete event")
    }
  },
}
