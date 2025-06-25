// Directive cho Next.js (không cần thiết trong React thuần)
"use client"

// Import React hooks
import { useState } from "react"
// Import React Router hooks
import { useNavigate, Link } from "react-router-dom"
// Import Redux hooks
import { useDispatch, useSelector } from "react-redux"
// Import Redux async actions
import { loginAsync, registerAsync } from "@/store/slices/authSlice"
// Import UI components
import { Button } from "@/components/ui"
// Import SCSS styles
import "./Login.scss"

// Login component - xử lý cả login và register
export const Login = () => {
  // Hook để navigate programmatically
  const navigate = useNavigate()
  // Hook để dispatch Redux actions
  const dispatch = useDispatch()
  // Lấy auth state từ Redux store
  const { isLoading, error } = useSelector((state) => state.auth)

  // Local state để quản lý form mode (login hoặc register)
  const [authMode, setAuthMode] = useState("login") // "login" hoặc "register"

  // Local state để quản lý form data
  const [formData, setFormData] = useState({
    username: "", // Username input
    email: "", // Email input (chỉ dùng cho register)
    password: "", // Password input
    fullName: "", // Full name input (chỉ dùng cho register)
  })

  // Function xử lý thay đổi input trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target // Destructure name và value từ input element
    // Update formData state với giá trị mới
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Async function xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent default form submission behavior

    try {
      if (authMode === "login") {
        // Nếu đang ở login mode
        await dispatch(
          loginAsync({
            username: formData.username, // Username hoặc email
            password: formData.password,
          }),
        ).unwrap() // unwrap() để throw error nếu action bị reject
      } else {
        // Nếu đang ở register mode
        await dispatch(registerAsync(formData)).unwrap() // Pass toàn bộ formData
      }
      // Nếu thành công, redirect về home page thay vì dashboard
      navigate("/")
    } catch (error) {
      // Log error (error sẽ được hiển thị qua Redux state)
      console.error("Auth error:", error)
    }
  }

  // JSX return
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
          {/* Dynamic Title dựa trên authMode */}
          <h1 className="login__title">{authMode === "login" ? "Welcome Back" : "Create Account"}</h1>
          {/* Dynamic Subtitle */}
          <p className="login__subtitle">
            {authMode === "login" ? "Sign in to your account to continue" : "Join us to manage your calendar"}
          </p>

          {/* Error Message - hiển thị nếu có error từ Redux */}
          {error && <div className="login__error">{error}</div>}

          {/* Login/Register Form */}
          <form onSubmit={handleSubmit} className="login__form">
            {/* Full Name Field - chỉ hiển thị khi register */}
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

            {/* Submit Button - text và loading state thay đổi theo mode */}
            <Button type="submit" className="login__submit-btn" loading={isLoading}>
              {authMode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          {/* Mode Switch - cho phép chuyển đổi giữa login và register */}
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
