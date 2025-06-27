"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { loginAsync, registerAsync } from "@/store/slices/authSlice"
import { Button } from "@/components/ui"
import "./Login.scss"

export const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoading, error } = useSelector((state) => state.auth)

  const [authMode, setAuthMode] = useState("login") 

  const [formData, setFormData] = useState({
    username: "", 
    email: "", 
    password: "", 
    fullName: "", 
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target 
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault() 

    try {
      if (authMode === "login") {
        await dispatch(
          loginAsync({
            username: formData.username, 
            password: formData.password,
          }),
        ).unwrap() 
      } else {
        await dispatch(registerAsync(formData)).unwrap() // Pass toàn bộ formData
      }
      navigate("/")
    } catch (error) {
      console.error("Auth error:", error)
    }
  }

  return (
    <div className="login">
      {/* Background Image */}
      <div
        className="login__background"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop')",
        }}
      />

      {/* Login Card Container */}
      <div className="login__container">
        <div className="login__card">
          <h1 className="login__title">{authMode === "login" ? "Welcome Back" : "Create Account"}</h1>
          <p className="login__subtitle">
            {authMode === "login" ? "Sign in to your account to continue" : "Join us to manage your calendar"}
          </p>

          {error && <div className="login__error">{error}</div>}

          <form onSubmit={handleSubmit} className="login__form">
            {authMode === "register" && (
              <div className="login__form-group">
                <label className="login__form-label">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="login__form-input"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            {/* Username Field - label thay đổi theo mode */}
            <div className="login__form-group">
              <label className="login__form-label">{authMode === "login" ? "Username or Email" : "Username"}</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="login__form-input"
                placeholder={authMode === "login" ? "Enter username or email" : "Enter username"}
                required
              />
            </div>

            {/* Email Field - chỉ hiển thị khi register */}
            {authMode === "register" && (
              <div className="login__form-group">
                <label className="login__form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="login__form-input"
                  placeholder="Enter your email"
                  required
                />
              </div>
            )}

            {/* Password Field */}
            <div className="login__form-group">
              <label className="login__form-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="login__form-input"
                placeholder="Enter your password"
                required
              />
            </div>

            <Button type="submit" className="login__submit-btn" loading={isLoading}>
              {authMode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="login__switch">
            <p>
              {authMode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                className="login__switch-btn"
              >
                {authMode === "login" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>

          {/* Back to Home Link */}
          <div className="login__back">
            <Link to="/" className="login__back-link">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
