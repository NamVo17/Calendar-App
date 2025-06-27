"use client"

import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import {
  fetchEventsAsync,
  createEventAsync,
  updateEventAsync,
  deleteEventAsync,
  setSelectedEvent,
} from "@/store/slices/eventSlice"

export const useEvents = () => {
  const dispatch = useDispatch() 

  const { events, selectedEvent, isLoading, error } = useSelector((state) => state.event)
  const { currentUser } = useSelector((state) => state.user)

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchEventsAsync(currentUser.id))
    }
  }, [dispatch, currentUser?.id]) 

  const createEvent = async (eventData) => {
    try {
      await dispatch(createEventAsync(eventData)).unwrap()
      return { success: true } 
    } catch (error) {
      return { success: false, error } 
    }
  }

  const updateEvent = async (eventData) => {
    try {
      await dispatch(updateEventAsync(eventData)).unwrap()
      return { success: true } 
    } catch (error) {
      return { success: false, error } 
    }
  }

  const deleteEvent = async (eventId) => {
    try {
      await dispatch(deleteEventAsync(eventId)).unwrap()
      return { success: true } 
    } catch (error) {
      return { success: false, error } 
    }
  }

  const selectEvent = (event) => {
    dispatch(setSelectedEvent(event)) 
  }

  const clearSelectedEvent = () => {
    dispatch(setSelectedEvent(null)) 
  }

  return {
    events, 
    selectedEvent, 
    isLoading, 
    error, 

    createEvent, 
    updateEvent, 
    deleteEvent, 
    selectEvent, 
    clearSelectedEvent, 
  }
}
