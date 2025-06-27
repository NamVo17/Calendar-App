"use client"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { fetchUsersAsync } from "@/store/slices/userSlice"

export const useInitialData = () => {
  const dispatch = useDispatch() 

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const savedData = localStorage.getItem("calendar-data")

        if (!savedData) {
          const response = await fetch("/database.json")
          if (response.ok) {
            const data = await response.json()
            localStorage.setItem("calendar-data", JSON.stringify(data))
            console.log("Initial data loaded from database.json")
          }
        }

        dispatch(fetchUsersAsync())
      } catch (error) {
        console.error("Error loading initial data:", error)
      }
    }

    loadInitialData()
  }, [dispatch]) 

}
