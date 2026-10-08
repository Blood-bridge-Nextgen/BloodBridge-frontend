import { useState } from "react";
import { LuMenu, LuX } from "react-icons/lu";
import "../App.css";
import { Link } from "react-router-dom";
import logo from "../assets/logo-symbol.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navigation-bar alignment-container">
      <div className="logo">
        <img className="logo-symbol" src={logo} alt="" />
        <h1 className="logo-text">
          Blood<span>Bridge</span>
        </h1>
        <p className="status-badge">SECURED</p>
      </div>
      <nav
        className={`nav-links${menuOpen ? " is-open" : ""}`}
        aria-label="Main navigation"
      >
        <a href="#StepsSection" onClick={closeMenu}>
          How It Works
        </a>
        <a href="#Features" onClick={closeMenu}>
          Features
        </a>
        <a href="#StepsSection" onClick={closeMenu}>
          About
        </a>
        <Link to="Contact" href="#Contact" onClick={closeMenu}>
          Contact
        </Link>
      </nav>
      <div className={`button navigation-cta${menuOpen ? " is-open" : ""}`}>
        <Link className="button-link" to="/OnboardingScreen">
          Create Account
        </Link>
      </div>
      <button
        className="nav-toggle"
        type="button"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <LuX aria-hidden="true" /> : <LuMenu aria-hidden="true" />}
      </button>
    </header>
  );
};

export default Header;
