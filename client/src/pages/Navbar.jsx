import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './AuthContext'

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const dropdownRef = useRef(null)

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu)
  }

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className='Navbar'>
      <div className="left-section">
        <Link to="/contacts">
          <img className='logo' src="img/circle.png" alt="Contact manager" />
        </Link>
        <h2 className='webname'>Contact Manager</h2>
      </div>
      
      <div className="actions">
        {isAuthenticated() && (
          <>
            <Link to="/add">
              <button className='add'>+</button>
            </Link>
            <Link to="/contacts">
              <img className='details' src="/info.png" alt="Contact Details" />
            </Link>
            
            {/* User Profile Section */}
            <div className="user-profile-container" ref={dropdownRef}>
              <button 
                className="user-profile-btn" 
                onClick={toggleUserMenu}
                aria-label="User profile menu"
              >
                <div className="user-avatar">
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
              </button>
              
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <h4>{user?.username || 'User'}</h4>
                    {user?.email && <p>{user.email}</p>}
                  </div>
                  <hr />
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Navbar