import { useState } from 'react'
import { LuMenu, LuX } from 'react-icons/lu'
import '../App.css'

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
  <header className='navigation-bar alignment-container'>
        <div className="logo">
            <img className='logo-symbol' src="src\assets\logo-symbol.png" alt="" />
            <h1 className='logo-text'>Blood<span>Bridge</span></h1>
            <p className='status-badge'>SECURED</p>
        </div>
    <nav className={`nav-links${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
      <a href="#" onClick={closeMenu}>How It Works</a>
      <a href="#" onClick={closeMenu}>Features</a>
      <a href="#" onClick={closeMenu}>About</a>
      <a href="#" onClick={closeMenu}>Contact</a>
    </nav>
    <div className={`button navigation-cta${menuOpen ? ' is-open' : ''}`}>
            <button>Become a Donor</button>
        </div>
    <button
      className="nav-toggle"
      type="button"
      aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
      aria-expanded={menuOpen}
      aria-controls="main-navigation"
      onClick={() => setMenuOpen((open) => !open)}
    >
      {menuOpen ? <LuX aria-hidden="true" /> : <LuMenu aria-hidden="true" />}
    </button>
  </header>
  )
}

export default Header