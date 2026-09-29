import React from 'react'
import '../App.css'

const Header = () => {
  return (
    <div className='navigation-bar'>
        <div className="logo">
            <img className='logo-symbol' src="src\assets\logo-symbol.png" alt="" />
            <h1 className='logo-text'>Blood<span>Bridge</span></h1>
            <p className='status-badge'>SECURED</p>
        </div>
        <div className="nav-links">
            <a href="#">How It Works</a>
            <a href="#">Features</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
        </div>
        <div className="button">
            <button>Become a Donor</button>
        </div>
    </div>
  )
}

export default Header