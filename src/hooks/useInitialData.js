"use client"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { fetchUsersAsync } from "@/store/slices/userSlice"

export const useInitialData = () => {
  const dispatch = useDispatch() 

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Không cần load data từ database.json nữa vì sẽ lấy từ server
        console.log("Initial data will be loaded from server")
        dispatch(fetchUsersAsync())
      } catch (error) {
        console.error("Error loading initial data:", error)
      }
    }

    loadInitialData()
  }, [dispatch]) 

}
