"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setCurrentUser } from "@/store/slices/userSlice"
import { setAuthenticated } from "@/store/slices/authSlice"

export const useAuth = () => {
  const dispatch = useDispatch() 

  const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth)
  const { currentUser } = useSelector((state) => state.user)

  useEffect(() => {
    const token = localStorage.getItem("auth-token")
    const savedUser = localStorage.getItem("current-user")

    if (token && savedUser) {
      try {
        const user = JSON.parse(savedUser)
        dispatch(setCurrentUser(user))
        dispatch(setAuthenticated(true))
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("auth-token")
        localStorage.removeItem("current-user")
      }
    }
  }, [dispatch]) 

  return {
    isAuthenticated, 
    isLoading, 
    error, 
    currentUser, 
  }
}
