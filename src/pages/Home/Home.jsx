"use client"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users, Calendar } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useCalendar } from "@/hooks/useCalendar"
import { useEvents } from "@/hooks/useEvents"
import { Button, Modal } from "@/components/ui"
import "./Home.scss"

export const Home = () => {
  const dispatch = useDispatch()

  const { isAuthenticated, currentUser } = useAuth() // Authentication state
  const { events, createEvent, selectEvent, selectedEvent, clearSelectedEvent } = useEvents() // Events state
  const {
    currentView,
    currentDate,
    selectedWeekStart,
    setCurrentView,
    goToToday,
    goToPreviousWeek,
    goToNextWeek,
    goToPreviousMonth,
    goToNextMonth,
    setSelectedWeekStart,
    setCurrentDate,
  } = useCalendar() 

  const [newEvent, setNewEvent] = useState({
    id: 0, 
    title: "", 
    startTime: "09:00", 
    endTime: "10:00", 
    color: "bg-blue-500", 
    date: new Date().toISOString().split("T")[0], // Ngày event (YYYY-MM-DD format)
    description: "", 
    location: "", 
    attendees: [], 
    organizer: "You", 
    user_id: null, 
  })

  const [attendeeInput, setAttendeeInput] = useState("") 
  const [isLoaded, setIsLoaded] = useState(false) 
  const [showCreateEventModal, setShowCreateEventModal] = useState(false) 
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false) 

  const colorOptions = [
    { name: "Blue", value: "bg-blue-500" },
    { name: "Green", value: "bg-green-500" },
    { name: "Purple", value: "bg-purple-500" },
    { name: "Yellow", value: "bg-yellow-500" },
    { name: "Indigo", value: "bg-indigo-500" },
    { name: "Pink", value: "bg-pink-500" },
    { name: "Teal", value: "bg-teal-500" },
    { name: "Cyan", value: "bg-cyan-500" },
    { name: "Orange", value: "bg-orange-500" },
    { name: "Red", value: "bg-red-500" },
  ]

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      setShowWelcomeMessage(true)
      const timer = setTimeout(() => {
        setShowWelcomeMessage(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, currentUser])

  useEffect(() => {
    // Khi vào trang, luôn focus vào tuần hiện tại
    goToToday();
    // eslint-disable-next-line
  }, []);

  const getWeekDates = (startDate) => {
    const week = []
    const start = new Date(startDate)
    const day = start.getDay() 
    start.setDate(start.getDate() - day) 

    for (let i = 0; i < 7; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      week.push(date.getDate()) 
    }
    return week
  }

  const formatCurrentMonth = (date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1) 
    const lastDay = new Date(year, month + 1, 0) 
    const daysInMonth = lastDay.getDate() 
    const firstDayOfWeek = firstDay.getDay() 

    const days = []
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }

  const handleEventClick = (event) => {
    selectEvent(event) 
  }

  
  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] 
  const weekDates = getWeekDates(selectedWeekStart) 
  const timeSlots = Array.from({ length: 9 }, (_, i) => i + 8) 

  const calculateEventStyle = (startTime, endTime) => {
    const start = Number.parseInt(startTime.split(":")[0]) + Number.parseInt(startTime.split(":")[1]) / 60
    const end = Number.parseInt(endTime.split(":")[0]) + Number.parseInt(endTime.split(":")[1]) / 60
    const top = (start - 8) * 80
    const height = (end - start) * 80
    return { top: `${top}px`, height: `${height}px` }
  }

  const miniCalendarDays = getDaysInMonth(currentDate) // Ngày trong tháng cho mini calendar
  const currentMonth = formatCurrentMonth(currentDate) // Tên tháng hiện tại

  const myCalendars = [
    { name: "My Calendar", color: "bg-blue-500" },
    { name: "Work", color: "bg-green-500" },
    { name: "Personal", color: "bg-purple-500" },
    { name: "Family", color: "bg-orange-500" },
  ]

  const calculateDayFromDate = (dateString) => {
    const date = new Date(dateString)
    return date.getDay() 
  }

  const handleCreateEvent = () => {
    if (!currentUser) {
      window.location.href = "/login"
      return
    }

    setShowCreateEventModal(true)

    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0") 
    const day = String(now.getDate()).padStart(2, "0")
    const todayString = `${year}-${month}-${day}`

    setNewEvent({
      id: Math.max(0, ...events.map((e) => e.id)) + 1, 
      title: "",
      startTime: "09:00",
      endTime: "10:00",
      color: "bg-blue-500",
      date: todayString,
      description: "",
      location: "",
      attendees: [],
      organizer: currentUser.fullName, 
      user_id: currentUser.id,
    })
    setAttendeeInput("") 
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewEvent((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddAttendee = () => {
    if (attendeeInput.trim()) {
      setNewEvent((prev) => ({
        ...prev,
        attendees: [...prev.attendees, attendeeInput.trim()], 
      }))
      setAttendeeInput("") 
    }
  }

  const handleRemoveAttendee = (index) => {
    setNewEvent((prev) => ({
      ...prev,
      attendees: prev.attendees.filter((_, i) => i !== index), 
    }))
  }

  const handleSubmitEvent = async (e) => {
    e.preventDefault() 

    if (!newEvent.title) {
      alert("Please enter an event title")
      return
    }

    const result = await createEvent(newEvent)
    if (result.success) {
      setShowCreateEventModal(false) 
    } else {
      alert("Failed to create event") 
    }
  }


  const formatCurrentWeekRange = (weekStart) => {
    const start = new Date(weekStart)
    const end = new Date(weekStart)
    end.setDate(end.getDate() + 6) 
    const startMonth = start.toLocaleDateString("en-US", { month: "short" })
    const endMonth = end.toLocaleDateString("en-US", { month: "short" })
    const startDay = start.getDate()
    const endDay = end.getDate()
    const year = start.getFullYear()

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}, ${year}`
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`
    }
  }

  const handleMiniCalendarDateClick = (day) => {
    if (!day) return 

    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const dayOfWeek = clickedDate.getDay() 
    const weekStart = new Date(clickedDate)
    weekStart.setDate(clickedDate.getDate() - dayOfWeek) 

    setSelectedWeekStart(weekStart)
    setCurrentDate(clickedDate)
  }

  return (
    <div className="home">
      {/* Background Image */}
      <div
        className="home__background"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop')",
        }}
      />

      

      {/* Main Content */}
      <main className="home__main">
        {/* Sidebar */}
        <div className={`home__sidebar ${isLoaded ? "home__sidebar--loaded" : ""}`}>
          <div className="home__sidebar-content">
            {/* Create Button */}
            <Button className="home__create-button" onClick={handleCreateEvent} icon={<Plus size={20} />}>
              Create
            </Button>

            {/* Mini Calendar */}
            <div className="home__mini-calendar">
              <div className="home__mini-calendar-header">
                <h3 className="home__mini-calendar-title">{currentMonth}</h3>
                <div className="home__mini-calendar-nav">
                  <button onClick={goToPreviousMonth} className="home__mini-calendar-nav-btn">
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={goToNextMonth} className="home__mini-calendar-nav-btn">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className="home__mini-calendar-grid">
                {/* Header row với tên các ngày trong tuần */}
                {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                  <div key={i} className="home__mini-calendar-day-header">
                    {day}
                  </div>
                ))}

                {/* Grid các ngày trong tháng */}
                {miniCalendarDays.map((day, i) => (
                  <div
                    key={i}
                    onClick={() => handleMiniCalendarDateClick(day)}
                    className={`home__mini-calendar-day ${!day ? "home__mini-calendar-day--empty" : ""} ${
                      // Highlight ngày hôm nay
                      day &&
                      new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString() ===
                        new Date().toDateString()
                        ? "home__mini-calendar-day--today"
                        : ""
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            {/* My Calendars Section */}
            <div className="home__my-calendars">
              <h3 className="home__my-calendars-title">My calendars</h3>
              <div className="home__my-calendars-list">
                {myCalendars.map((cal, i) => (
                  <div key={i} className="home__calendar-item">
                    <div className={`home__calendar-color ${cal.color}`}></div>
                    <span className="home__calendar-name">{cal.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        <div className={`home__calendar ${isLoaded ? "home__calendar--loaded" : ""}`}>
          {/* Calendar Controls */}
          <div className="home__calendar-controls">
            <div className="home__calendar-controls-left">
              <Button onClick={goToToday} size="small">
                Today
              </Button>
              <div className="home__calendar-nav">
                <button onClick={goToPreviousWeek} className="home__calendar-nav-btn">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={goToNextWeek} className="home__calendar-nav-btn">
                  <ChevronRight size={20} />
                </button>
              </div>
              <h2 className="home__calendar-title">{formatCurrentWeekRange(selectedWeekStart)}</h2>
            </div>

            {/* View Switcher */}
            <div className="home__calendar-view-switcher">
              <button
                onClick={() => setCurrentView("day")}
                className={`home__view-btn ${currentView === "day" ? "home__view-btn--active" : ""}`}
              >
                Day
              </button>
              <button
                onClick={() => setCurrentView("week")}
                className={`home__view-btn ${currentView === "week" ? "home__view-btn--active" : ""}`}
              >
                Week
              </button>
              <button
                onClick={() => setCurrentView("month")}
                className={`home__view-btn ${currentView === "month" ? "home__view-btn--active" : ""}`}
              >
                Month
              </button>
            </div>
          </div>

          {/* Week View Content */}
          <div className="home__calendar-content">
            <div className="home__calendar-grid">
              {/* Week Header - hiển thị tên ngày và số ngày */}
              <div className="home__calendar-header">
                <div className="home__calendar-time-header"></div>
                {weekDays.map((day, i) => (
                  <div key={i} className="home__calendar-day-header">
                    <div className="home__calendar-day-name">{day}</div>
                    <div
                      className={`home__calendar-day-number ${
                        // Highlight ngày hôm nay
                        new Date(selectedWeekStart.getTime() + i * 24 * 60 * 60 * 1000).toDateString() ===
                        new Date().toDateString()
                          ? "home__calendar-day-number--today"
                          : ""
                      }`}
                    >
                      {weekDates[i]}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Grid */}
              <div className="home__calendar-body">
                {/* Time Labels Column */}
                <div className="home__calendar-time-column">
                  {timeSlots.map((time, i) => (
                    <div key={i} className="home__calendar-time-slot">
                      {/* Format time: 8 AM, 9 AM, 1 PM, etc. */}
                      {time > 12 ? `${time - 12} PM` : `${time} AM`}
                    </div>
                  ))}
                </div>

                {/* Days Columns - 7 cột cho 7 ngày trong tuần */}
                {Array.from({ length: 7 }).map((_, dayIndex) => (
                  <div key={dayIndex} className="home__calendar-day-column">
                    {/* Time cells - tạo grid cho mỗi time slot */}
                    {timeSlots.map((_, timeIndex) => (
                      <div key={timeIndex} className="home__calendar-time-cell"></div>
                    ))}

                    {/* Events - chỉ hiển thị nếu user đã authenticated */}
                    {isAuthenticated &&
                      events
                        .filter((event) => {
                          // Lọc events theo ngày: chỉ hiển thị events của ngày hiện tại
                          const eventDate = new Date(event.date)
                          const currentDayStart = new Date(selectedWeekStart)
                          currentDayStart.setDate(currentDayStart.getDate() + dayIndex)
                          return eventDate.toDateString() === currentDayStart.toDateString()
                        })
                        .map((event, i) => {
                          // Tính toán style cho event dựa trên thời gian
                          const eventStyle = calculateEventStyle(event.startTime, event.endTime)
                          return (
                            <div
                              key={i}
                              className={`home__calendar-event ${event.color}`} // Apply màu sắc từ event
                              style={{
                                ...eventStyle, // Position và height
                                left: "4px", // Margin từ bên trái
                                right: "4px", // Margin từ bên phải
                                minHeight: "32px", // Chiều cao tối thiểu
                              }}
                              onClick={() => handleEventClick(event)} // Click để xem chi tiết
                            >
                              <div className="home__calendar-event-title">{event.title}</div>
                              <div className="home__calendar-event-time">{`${event.startTime} - ${event.endTime}`}</div>
                            </div>
                          )
                        })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Event Detail Modal - hiển thị chi tiết event khi click */}
      <Modal isOpen={!!selectedEvent} onClose={clearSelectedEvent} title={selectedEvent?.title} className={selectedEvent?.color || ''}>
        {selectedEvent && (
          <div className="home__event-details" >
            {/* Thời gian event */}
            <div className="home__event-detail ">
              <Clock size={20} />
              <span>{`${selectedEvent.startTime} - ${selectedEvent.endTime}`}</span>
            </div>
            {/* Địa điểm event */}
            <div className="home__event-detail">
              <MapPin size={20} />
              <span>{selectedEvent.location}</span>
            </div>
            {/* Ngày event */}
            <div className="home__event-detail">
              <Calendar size={20} />
              <span>{`${weekDays[calculateDayFromDate(selectedEvent.date)]}, ${new Date(selectedEvent.date).getDate()} ${currentMonth}`}</span>
            </div>
            {/* Danh sách attendees */}
            <div className="home__event-detail">
              <Users size={20} />
              <div>
                <strong>Attendees:</strong>
                <br />
                {selectedEvent.attendees.join(", ") || "No attendees"}
              </div>
            </div>
            {/* Organizer */}
            <div className="home__event-detail">
              <strong>Organizer:</strong> {selectedEvent.organizer}
            </div>
            {/* Mô tả event */}
            <div className="home__event-detail">
              <strong>Description:</strong> {selectedEvent.description}
            </div>
          </div>
        )}
      </Modal>

      {/* Create Event Modal - form tạo event mới */}
      <Modal isOpen={showCreateEventModal} onClose={() => setShowCreateEventModal(false)} title="Create New Event">
        <form onSubmit={handleSubmitEvent} className="home__create-event-form">
          {/* Event Title */}
          <div className="home__form-group">
            <label className="home__form-label">Title</label>
            <input
              type="text"
              name="title"
              value={newEvent.title}
              onChange={handleInputChange}
              className="home__form-input"
              placeholder="Event title"
            />
          </div>

          {/* Date, Start Time, End Time - 3 cột */}
          <div className="home__form-row">
            <div className="home__form-group">
              <label className="home__form-label">Date</label>
              <input
                type="date"
                name="date"
                value={newEvent.date}
                onChange={handleInputChange}
                className="home__form-input"
              />
            </div>
            <div className="home__form-group">
              <label className="home__form-label">Start</label>
              <input
                type="time"
                name="startTime"
                value={newEvent.startTime}
                onChange={handleInputChange}
                className="home__form-input"
              />
            </div>
            <div className="home__form-group">
              <label className="home__form-label">End</label>
              <input
                type="time"
                name="endTime"
                value={newEvent.endTime}
                onChange={handleInputChange}
                className="home__form-input"
              />
            </div>
          </div>

          {/* Location */}
          <div className="home__form-group">
            <label className="home__form-label">Location</label>
            <input
              type="text"
              name="location"
              value={newEvent.location}
              onChange={handleInputChange}
              className="home__form-input"
              placeholder="Event location"
            />
          </div>

          {/* Organizer */}
          <div className="home__form-group">
            <label className="home__form-label">Organizer</label>
            <input
              type="text"
              name="organizer"
              value={newEvent.organizer}
              onChange={handleInputChange}
              className="home__form-input"
              placeholder="Event organizer"
            />
          </div>

          {/* Description */}
          <div className="home__form-group">
            <label className="home__form-label">Description</label>
            <textarea
              name="description"
              value={newEvent.description}
              onChange={handleInputChange}
              className="home__form-textarea"
              placeholder="Event description"
            />
          </div>

          {/* Color Selection */}
          <div className="home__form-group">
            <label className="home__form-label">Color</label>
            <div className="home__color-options">
              {colorOptions.map((color, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setNewEvent((prev) => ({ ...prev, color: color.value }))}
                  className={`home__color-option ${color.value} ${
                    newEvent.color === color.value ? "home__color-option--selected" : ""
                  }`}
                  title={color.name} // Tooltip hiển thị tên màu
                />
              ))}
            </div>
          </div>

          {/* Attendees Management */}
          <div className="home__form-group">
            <label className="home__form-label">Attendees</label>
            {/* Input để thêm attendee */}
            <div className="home__attendee-input">
              <input
                type="text"
                value={attendeeInput}
                onChange={(e) => setAttendeeInput(e.target.value)}
                className="home__form-input"
                placeholder="Add attendee"
              />
              <Button type="button" onClick={handleAddAttendee} size="small">
                Add
              </Button>
            </div>

            {/* Danh sách attendees đã thêm */}
            {newEvent.attendees.length > 0 && (
              <div className="home__attendee-list">
                {newEvent.attendees.map((attendee, index) => (
                  <div key={index} className="home__attendee-tag">
                    <span>{attendee}</span>
                    <button type="button" onClick={() => handleRemoveAttendee(index)} className="home__attendee-remove">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="home__form-actions">
            <Button type="button" variant="secondary" onClick={() => setShowCreateEventModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Event</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
