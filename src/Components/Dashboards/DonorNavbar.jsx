import { useState } from 'react'
import { Bell, LogOut, Menu, X } from 'lucide-react'
import logoSymbol from '../../assets/logo-symbol.png'
import './Dashboard.css'

const navLinks = [
  { id: 'requests', label: 'Emergency Requests', href: '/DonorDashboard' },
  { id: 'donations', label: 'My Donations', href: '/DonorDashboard/donations' },
  { id: 'profile', label: 'Profile', href: '/DonorDashboard/profile' },
]

const DonorNavbar = ({ activeLink = 'requests', onLogout = () => {}, onNotifications = () => {} }) => {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="donor-navbar">
      <div className="alignment-container donor-navbar__inner">
        <a className="donor-navbar__brand" href="/" aria-label="BloodBridge home" onClick={closeMenu}>
          <img className="donor-navbar__logo" src={logoSymbol} alt="" />
          <span className="donor-navbar__wordmark"><span>Blood</span><span>Bridge</span></span>
        </a>

        <nav className={`donor-navbar__links${menuOpen ? ' donor-navbar__links--open' : ''}`} aria-label="Donor navigation">
          {navLinks.map((link) => (
            <a
              className={`donor-navbar__link${activeLink === link.id ? ' donor-navbar__link--active' : ''}`}
              href={link.href}
              aria-current={activeLink === link.id ? 'page' : undefined}
              key={link.id}
              onClick={closeMenu}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="donor-navbar__actions">
          <button className="donor-navbar__icon-button" type="button" aria-label="Notifications" onClick={onNotifications}>
            <Bell aria-hidden="true" />
            <span className="donor-navbar__notification-dot" aria-hidden="true" />
          </button>
          <button className="donor-navbar__logout" type="button" onClick={onLogout}>
            <LogOut aria-hidden="true" />
            <span>Logout</span>
          </button>
          <button
            className="donor-navbar__menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="donor-navigation-links"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
      <nav
        className={`donor-navbar__mobile-links${menuOpen ? ' donor-navbar__mobile-links--open' : ''}`}
        id="donor-navigation-links"
        aria-label="Mobile donor navigation"
      >
        {navLinks.map((link) => (
          <a
            className={`donor-navbar__mobile-link${activeLink === link.id ? ' donor-navbar__mobile-link--active' : ''}`}
            href={link.href}
            aria-current={activeLink === link.id ? 'page' : undefined}
            key={link.id}
            onClick={closeMenu}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  )
}

export default DonorNavbar
