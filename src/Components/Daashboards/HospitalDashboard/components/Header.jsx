import { Bell, ChevronDown, Plus } from 'lucide-react'
import '../styles/header.css'

const navigation = ['Dashboard', 'Blood Requests', 'Donors', 'Inventory', 'Reports', 'Settings']

const Header = ({ activeSection = 'Dashboard', onRequestBlood = () => {} }) => (
  <header className="hospital-dashboard__header">
    <div className="hospital-dashboard__brand">
      <span className="hospital-dashboard__brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 3.5 5.5 10a6.5 6.5 0 1 0 13 0L12 3.5Z" fill="currentColor" />
          <path d="M8.5 12.5c.7 1.1 1.8 1.7 3.5 1.7s2.8-.6 3.5-1.7" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
      <div className="hospital-dashboard__brand-copy">
        <span className="hospital-dashboard__brand-blood">Blood</span>
        <span className="hospital-dashboard__brand-bridge">Bridge</span>
      </div>
      <span className="hospital-dashboard__title">Dashboard</span>
    </div>

    <nav className="hospital-dashboard__nav" aria-label="Main navigation">
      {navigation.map((item) => (
        <button
          key={item}
          type="button"
          className={`hospital-dashboard__nav-item${item === activeSection ? ' hospital-dashboard__nav-item--active' : ''}`}
        >
          {item}
        </button>
      ))}
    </nav>

    <div className="hospital-dashboard__header-actions">
      <button className="hospital-dashboard__icon-button" type="button" aria-label="Notifications">
        <Bell aria-hidden="true" />
        <span className="hospital-dashboard__notification-dot" aria-hidden="true" />
      </button>
      <button className="hospital-dashboard__request-button" type="button" onClick={onRequestBlood}>
        <Plus aria-hidden="true" /> Request Blood
      </button>
      <button className="hospital-dashboard__user-button" type="button" aria-label="Open account menu">
        <span className="hospital-dashboard__avatar">LC</span>
        <span className="hospital-dashboard__user-name">Lagos City</span>
        <ChevronDown aria-hidden="true" />
      </button>
    </div>
  </header>
)

export default Header
