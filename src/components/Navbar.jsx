import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/" onClick={closeMenu}>
            <h2>BestPadel</h2>
          </Link>
        </div>
        
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
          </li>
          <li className="nav-item">
            <a href="#about" className="nav-link" onClick={closeMenu}>About Padel</a>
          </li>
          <li className="nav-item">
            <a href="#growth" className="nav-link" onClick={closeMenu}>Growth</a>
          </li>
          <li className="nav-item">
            <a href="#investment" className="nav-link" onClick={closeMenu}>Investment</a>
          </li>
          <li className="nav-item">
            <Link to="/americano" className="nav-link" onClick={closeMenu}>Americano</Link>
          </li>
          <li className="nav-item">
            <a href="#contact" className="nav-link" onClick={closeMenu}>Contact</a>
          </li>
        </ul>
        
        <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
