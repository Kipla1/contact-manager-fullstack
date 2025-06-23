import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <div className='Navbar'>
      <div className="left-section">
        <Link to="/contacts">
          <img className='logo' src="img/circle.png" alt="Contact manager" />
        </Link>
        <h2 className='webname'>Contact Manager</h2>
      </div>
      
      <div className="actions">
        <Link to="/add">
          <button className='add'>+</button>
        </Link>
        <Link to="/contacts">
          <img className='details' src="/info.png" alt="Contact Details" />
        </Link>
      </div>
    </div>
  )
}

export default Navbar