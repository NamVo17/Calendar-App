// Directive cho Next.js (không cần thiết trong React thuần)
"use client"

// Import React hooks
import { useState } from "react"
// Import React Router hooks
import { Link, useNavigate } from "react-router-dom"
// Import Redux hooks
import { useSelector, useDispatch } from "react-redux"
// Import icons từ lucide-react
import { Menu, Search, Settings, User, LogOut } from "lucide-react"
// Import Redux action
import { logoutAsync } from "@/store/slices/authSlice"
// Import SCSS styles
import "./Navbar.scss"

// Navbar component - navigation bar ở top của app
export const Navbar = () => {
  // Hook để navigate programmatically
  const navigate = useNavigate()
  // Hook để dispatch Redux actions
  const dispatch = useDispatch()

  // Lấy auth state từ Redux store
  const { isAuthenticated } = useSelector((state) => state.auth)
  // Lấy current user từ Redux store
  const { currentUser } = useSelector((state) => state.user)

  // Local state để quản lý user dropdown menu
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Async function xử lý logout
  const handleLogout = async () => {
    // Dispatch logout action
    await dispatch(logoutAsync())
    // Đóng user menu
    setShowUserMenu(false)
    // Navigate về home page
    navigate("/")
  }

  return (
    <nav className="navbar">
      <div className="navbar__container">
        {/* Left side của navbar */}
        <div className="navbar__left">
          {/* Menu icon (hamburger menu) */}
          <Menu className="navbar__menu-icon" />
          {/* Brand/Logo - link về home page */}
          <Link to="/" className="navbar__brand">
            Calendar
          </Link>
        </div>

        {/* Right side của navbar */}
        <div className="navbar__right">
          {/* Search box */}
          <div className="navbar__search">
            <Search className="navbar__search-icon" />
            <input type="text" placeholder="Search" className="navbar__search-input" />
          </div>

          {/* Settings icon */}
          <Settings className="navbar__settings-icon" />

          {/* User section - hiển thị khác nhau tùy theo authentication status */}
          {isAuthenticated && currentUser ? (
            // Nếu đã login - hiển thị user menu
            <div className="navbar__user">
              {/* User button - click để toggle dropdown */}
              <button className="navbar__user-button" onClick={() => setShowUserMenu(!showUserMenu)}>
                {/* User avatar */}
                <div className="navbar__user-avatar">
                  <User size={16} />
                </div>
                {/* User name - chỉ hiển thị trên desktop */}
                <span className="navbar__user-name">{currentUser.fullName}</span>
              </button>

              {/* User dropdown menu - hiển thị khi showUserMenu = true */}
              {showUserMenu && (
                <div className="navbar__user-menu">
                  {/* User info section */}
                  <div className="navbar__user-info">
                    <p className="navbar__user-info-name">{currentUser.fullName}</p>
                    <p className="navbar__user-info-email">{currentUser.email}</p>
                  </div>
                  {/* Logout button */}
                  <button onClick={handleLogout} className="navbar__user-menu-item">
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Nếu chưa login - hiển thị login button
            <Link to="/login" className="navbar__login-button">
              <User size={20} />
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
