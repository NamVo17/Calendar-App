"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Menu, Search, Settings, User, LogOut } from "lucide-react"
import { logoutAsync } from "@/store/slices/authSlice"
import "./Navbar.scss"

export const Navbar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { isAuthenticated } = useSelector((state) => state.auth)
  const { currentUser } = useSelector((state) => state.user)

  const [showUserMenu, setShowUserMenu] = useState(false)


  const handleLogout = async () => {

    await dispatch(logoutAsync())

    setShowUserMenu(false)
    navigate("/")
  }

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <div className="navbar__left">
          <Menu className="navbar__menu-icon" />
          <Link to="/" className="navbar__brand">
            Calendar
          </Link>
        </div>

        <div className="navbar__right">
          <div className="navbar__search">
            <Search className="navbar__search-icon" />
            <input type="text" placeholder="Search" className="navbar__search-input" />
          </div>

          <Settings className="navbar__settings-icon" />

          {isAuthenticated && currentUser ? (
            <div className="navbar__user">
              <button className="navbar__user-button" onClick={() => setShowUserMenu(!showUserMenu)}>
                <div className="navbar__user-avatar">
                  <User size={16} />
                </div>
                <span className="navbar__user-name">{currentUser.fullName}</span>
              </button>

              {showUserMenu && (
                <div className="navbar__user-menu">
                  
                  <div className="navbar__user-info">
                    <p className="navbar__user-info-name">{currentUser.fullName}</p>
                    <p className="navbar__user-info-email">{currentUser.email}</p>
                  </div>
                  
                  <button onClick={handleLogout} className="navbar__user-menu-item">
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="navbar__login-button">
              <User size={20} />
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
