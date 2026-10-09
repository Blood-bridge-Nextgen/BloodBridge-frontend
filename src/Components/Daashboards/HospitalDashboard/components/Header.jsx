import { Bell, ChevronDown, Plus } from 'lucide-react'
import logoSymbol from '../../../../assets/logo-symbol.png'
import '../styles/header.css'

const navigation = ['Dashboard', 'Blood Requests', 'Donors', 'Inventory', 'Reports', 'Settings']

const Header = ({ activeSection = 'Dashboard', onRequestBlood = () => {} }) => (
  <header className="hospital-dashboard__header">
    <div className="hospital-dashboard__brand">
      <span className="hospital-dashboard__brand-mark" aria-hidden="true">
        <img src={logoSymbol} alt="" />
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
