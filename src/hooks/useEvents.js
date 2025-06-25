// Directive cho Next.js (không cần thiết trong React thuần)
"use client"

// Import useSelector và useDispatch từ react-redux
import { useSelector, useDispatch } from "react-redux"
// Import useEffect để chạy side effects
import { useEffect } from "react"
// Import tất cả event actions từ eventSlice
import {
  fetchEventsAsync,
  createEventAsync,
  updateEventAsync,
  deleteEventAsync,
  setSelectedEvent,
} from "@/store/slices/eventSlice"

// Custom hook để quản lý events logic
export const useEvents = () => {
  const dispatch = useDispatch() // Hook để dispatch actions

  // Lấy event state từ Redux store
  const { events, selectedEvent, isLoading, error } = useSelector((state) => state.event)
  // Lấy current user từ Redux store
  const { currentUser } = useSelector((state) => state.user)

  // useEffect để fetch events khi currentUser thay đổi
  useEffect(() => {
    // Chỉ fetch events nếu có currentUser và có ID
    if (currentUser?.id) {
      dispatch(fetchEventsAsync(currentUser.id))
    }
  }, [dispatch, currentUser?.id]) // Dependencies: dispatch và currentUser.id

  // Async function để tạo event mới
  const createEvent = async (eventData) => {
    try {
      // Dispatch createEventAsync và unwrap để lấy kết quả
      await dispatch(createEventAsync(eventData)).unwrap()
      return { success: true } // Return success nếu không có lỗi
    } catch (error) {
      return { success: false, error } // Return error nếu có lỗi
    }
  }

  // Async function để update event
  const updateEvent = async (eventData) => {
    try {
      // Dispatch updateEventAsync và unwrap để lấy kết quả
      await dispatch(updateEventAsync(eventData)).unwrap()
      return { success: true } // Return success nếu không có lỗi
    } catch (error) {
      return { success: false, error } // Return error nếu có lỗi
    }
  }

  // Async function để xóa event
  const deleteEvent = async (eventId) => {
    try {
      // Dispatch deleteEventAsync và unwrap để lấy kết quả
      await dispatch(deleteEventAsync(eventId)).unwrap()
      return { success: true } // Return success nếu không có lỗi
    } catch (error) {
      return { success: false, error } // Return error nếu có lỗi
    }
  }

  // Function để select một event (để xem chi tiết)
  const selectEvent = (event) => {
    dispatch(setSelectedEvent(event)) // event: Event object
  }

  // Function để clear selected event
  const clearSelectedEvent = () => {
    dispatch(setSelectedEvent(null)) // Set về null
  }

  // Return tất cả state values và functions
  return {
    // State values
    events, // Array: danh sách events
    selectedEvent, // Object: event đang được chọn
    isLoading, // Boolean: trạng thái loading
    error, // String: error message nếu có

    // Functions
    createEvent, // Function: tạo event mới
    updateEvent, // Function: update event
    deleteEvent, // Function: xóa event
    selectEvent, // Function: chọn event để xem chi tiết
    clearSelectedEvent, // Function: bỏ chọn event
  }
}
