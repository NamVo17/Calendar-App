// Directive cho Next.js (không cần thiết trong React thuần)
"use client"

// Import React hooks
import { useState, useEffect } from "react"
// Import useDispatch để dispatch Redux actions
import { useDispatch } from "react-redux"
// Import các icons từ lucide-react
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users, Calendar } from "lucide-react"
// Import custom hooks
import { useAuth } from "@/hooks/useAuth"
import { useCalendar } from "@/hooks/useCalendar"
import { useEvents } from "@/hooks/useEvents"
// Import UI components
import { Button, Modal } from "@/components/ui"
// Import SCSS styles
import "./Home.scss"

// Main Home component
export const Home = () => {
  // Redux dispatch hook
  const dispatch = useDispatch()

  // Custom hooks để lấy state và functions
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
  } = useCalendar() // Calendar state

  // Local state cho new event form
  const [newEvent, setNewEvent] = useState({
    id: 0, // ID sẽ được generate
    title: "", // Tiêu đề event
    startTime: "09:00", // Thời gian bắt đầu
    endTime: "10:00", // Thời gian kết thúc
    color: "bg-blue-500", // Màu sắc event
    date: new Date().toISOString().split("T")[0], // Ngày event (YYYY-MM-DD format)
    description: "", // Mô tả event
    location: "", // Địa điểm
    attendees: [], // Danh sách người tham gia
    organizer: "You", // Người tổ chức
    user_id: null, // ID của user tạo event
  })

  // Local state khác
  const [attendeeInput, setAttendeeInput] = useState("") // Input để thêm attendee
  const [isLoaded, setIsLoaded] = useState(false) // Trạng thái đã load xong
  const [showCreateEventModal, setShowCreateEventModal] = useState(false) // Hiển thị modal tạo event
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false) // Hiển thị welcome message

  // Array các màu sắc có thể chọn cho event
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

  // useEffect để set isLoaded sau khi component mount
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // useEffect để hiển thị welcome message khi user login
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      setShowWelcomeMessage(true)
      // Tự động ẩn message sau 3 giây
      const timer = setTimeout(() => {
        setShowWelcomeMessage(false)
      }, 3000)

      // Cleanup timer khi component unmount hoặc dependencies thay đổi
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, currentUser])

  // Function để tính toán các ngày trong tuần từ ngày bắt đầu
  const getWeekDates = (startDate) => {
    const week = []
    const start = new Date(startDate)
    const day = start.getDay() // 0 = Chủ nhật, 1 = Thứ 2, ...
    start.setDate(start.getDate() - day) // Set về Chủ nhật

    // Tạo array 7 ngày trong tuần
    for (let i = 0; i < 7; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      week.push(date.getDate()) // Chỉ lấy số ngày
    }
    return week
  }

  // Function để format tháng hiện tại thành string
  const formatCurrentMonth = (date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  // Function để lấy tất cả ngày trong tháng cho mini calendar
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1) // Ngày đầu tháng
    const lastDay = new Date(year, month + 1, 0) // Ngày cuối tháng
    const daysInMonth = lastDay.getDate() // Số ngày trong tháng
    const firstDayOfWeek = firstDay.getDay() // Thứ mấy của ngày đầu tháng

    const days = []
    // Thêm các ô trống cho những ngày trước ngày đầu tháng
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }
    // Thêm tất cả ngày trong tháng
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }

  // Function xử lý khi click vào event
  const handleEventClick = (event) => {
    selectEvent(event) // Set event làm selected event
  }

  // Constants
  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] // Tên các ngày trong tuần
  const weekDates = getWeekDates(selectedWeekStart) // Các ngày trong tuần hiện tại
  const timeSlots = Array.from({ length: 9 }, (_, i) => i + 8) // Time slots từ 8AM đến 4PM

  // Function để tính toán style cho event dựa trên thời gian
  const calculateEventStyle = (startTime, endTime) => {
    // Parse start time thành số (ví dụ: "09:30" -> 9.5)
    const start = Number.parseInt(startTime.split(":")[0]) + Number.parseInt(startTime.split(":")[1]) / 60
    // Parse end time thành số
    const end = Number.parseInt(endTime.split(":")[0]) + Number.parseInt(endTime.split(":")[1]) / 60
    // Tính position và height (mỗi giờ = 80px, bắt đầu từ 8AM)
    const top = (start - 8) * 80
    const height = (end - start) * 80
    return { top: `${top}px`, height: `${height}px` }
  }

  // Computed values
  const miniCalendarDays = getDaysInMonth(currentDate) // Ngày trong tháng cho mini calendar
  const currentMonth = formatCurrentMonth(currentDate) // Tên tháng hiện tại

  // Mock data cho "My Calendars" section
  const myCalendars = [
    { name: "My Calendar", color: "bg-blue-500" },
    { name: "Work", color: "bg-green-500" },
    { name: "Personal", color: "bg-purple-500" },
    { name: "Family", color: "bg-orange-500" },
  ]

  // Function để tính ngày trong tuần từ date string
  const calculateDayFromDate = (dateString) => {
    const date = new Date(dateString)
    return date.getDay() // 0 = Chủ nhật, 1 = Thứ 2, ...
  }

  // Function xử lý khi click Create button
  const handleCreateEvent = () => {
    // Nếu chưa login, redirect đến login page
    if (!currentUser) {
      window.location.href = "/login"
      return
    }

    // Hiển thị modal tạo event
    setShowCreateEventModal(true)

    // Tạo date string cho hôm nay
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0") // Tháng bắt đầu từ 0
    const day = String(now.getDate()).padStart(2, "0")
    const todayString = `${year}-${month}-${day}`

    // Reset new event form với default values
    setNewEvent({
      id: Math.max(0, ...events.map((e) => e.id)) + 1, // Generate ID mới
      title: "",
      startTime: "09:00",
      endTime: "10:00",
      color: "bg-blue-500",
      date: todayString,
      description: "",
      location: "",
      attendees: [],
      organizer: currentUser.fullName, // Set organizer là current user
      user_id: currentUser.id,
    })
    setAttendeeInput("") // Clear attendee input
  }

  // Function xử lý thay đổi input trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target
    // Update newEvent state với giá trị mới
    setNewEvent((prev) => ({ ...prev, [name]: value }))
  }

  // Function để thêm attendee vào danh sách
  const handleAddAttendee = () => {
    if (attendeeInput.trim()) {
      // Chỉ thêm nếu input không rỗng
      setNewEvent((prev) => ({
        ...prev,
        attendees: [...prev.attendees, attendeeInput.trim()], // Thêm vào array
      }))
      setAttendeeInput("") // Clear input
    }
  }

  // Function để xóa attendee khỏi danh sách
  const handleRemoveAttendee = (index) => {
    setNewEvent((prev) => ({
      ...prev,
      attendees: prev.attendees.filter((_, i) => i !== index), // Filter bỏ attendee tại index
    }))
  }

  // Function xử lý submit form tạo event
  const handleSubmitEvent = async (e) => {
    e.preventDefault() // Prevent default form submission

    // Validation: kiểm tra title không rỗng
    if (!newEvent.title) {
      alert("Please enter an event title")
      return
    }

    // Gọi createEvent function từ useEvents hook
    const result = await createEvent(newEvent)
    if (result.success) {
      setShowCreateEventModal(false) // Đóng modal nếu thành công
    } else {
      alert("Failed to create event") // Hiển thị error nếu thất bại
    }
  }

  // Function để format range của tuần hiện tại
  const formatCurrentWeekRange = (weekStart) => {
    const start = new Date(weekStart)
    const end = new Date(weekStart)
    end.setDate(end.getDate() + 6) // Cuối tuần = đầu tuần + 6 ngày

    const startMonth = start.toLocaleDateString("en-US", { month: "short" })
    const endMonth = end.toLocaleDateString("en-US", { month: "short" })
    const startDay = start.getDate()
    const endDay = end.getDate()
    const year = start.getFullYear()

    // Nếu cùng tháng: "Jan 1 - 7, 2025"
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}, ${year}`
    } else {
      // Nếu khác tháng: "Jan 30 - Feb 5, 2025"
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`
    }
  }

  // Function xử lý click vào ngày trong mini calendar
  const handleMiniCalendarDateClick = (day) => {
    if (!day) return // Ignore nếu click vào ô trống

    // Tạo Date object cho ngày được click
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const dayOfWeek = clickedDate.getDay() // Thứ mấy trong tuần
    const weekStart = new Date(clickedDate)
    weekStart.setDate(clickedDate.getDate() - dayOfWeek) // Tính ngày đầu tuần

    // Update calendar state để navigate đến tuần chứa ngày được click
    setSelectedWeekStart(weekStart)
    setCurrentDate(clickedDate)
  }

  // JSX return
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
      <Modal isOpen={!!selectedEvent} onClose={clearSelectedEvent} title={selectedEvent?.title}   >
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
