export const eventService = {
  async getEvents(userId) {
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

      return data.events.filter((event) => event.user_id === userId)
    } catch (error) {
      throw new Error(error.message || "Failed to fetch events")
    }
  },

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

      return data.events
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

      const currentUser = JSON.parse(localStorage.getItem("current-user") || "null")

      const newEvent = {
        id: Math.max(0, ...data.events.map((e) => e.id)) + 1, 
        ...eventData, 
        user_id: currentUser?.id || 1, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString(), 
      }

      data.events.push(newEvent)
      localStorage.setItem("calendar-data", JSON.stringify(data))

      return newEvent
    } catch (error) {
      throw new Error(error.message || "Failed to create event")
    }
  },

  async updateEvent(eventData) {
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

      const eventIndex = data.events.findIndex((e) => e.id === eventData.id)
      if (eventIndex === -1) {
        throw new Error("Event not found")
      }

      const updatedEvent = {
        ...data.events[eventIndex], 
        ...eventData, 
        updatedAt: new Date().toISOString(), 
      }
      data.events[eventIndex] = updatedEvent
      localStorage.setItem("calendar-data", JSON.stringify(data))

      return updatedEvent
    } catch (error) {
      throw new Error(error.message || "Failed to update event")
    }
  },

  async deleteEvent(id) {
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

      data.events = data.events.filter((e) => e.id !== id)
      localStorage.setItem("calendar-data", JSON.stringify(data))
    } catch (error) {
      throw new Error(error.message || "Failed to delete event")
    }
  },
}
