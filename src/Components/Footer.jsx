const companyLinks = ['How It Works', 'Hospital Portal', 'Donor Safety', 'Support']

function Footer() {
  return (
    <>
      <section className="footer-cta" aria-labelledby="footer-cta-title">
        <div className="alignment-container">
          <div className="footer-cta-content">
            <p className="footer-cta-badge">JOIN THE ALLIANCE</p>
            <h2 id="footer-cta-title">Every Donation Saves Lives</h2>
            <p>
              Join BloodBridge today and be part of a secure network that makes blood donation and hospital emergency matching faster, safer, and fully traceable.
            </p>
            <div className="footer-cta-actions">
              <a className="footer-cta-button footer-cta-button-primary" href="#register">
                Register as a Donor
              </a>
              <a className="footer-cta-button footer-cta-button-secondary" href="#contact">
                Partner With Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="alignment-container">
          <div className="editorial-footer-top">
            <div className="editorial-footer-lead">
              <a className="editorial-footer-logo" href="#top" aria-label="BloodBridge home">
                <span className="editorial-footer-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21s-8-4.6-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.4-8 11-8 11Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                    <path d="M8.5 12h2l1-2 1.5 4 1-2h1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>Blood<span>Bridge</span></span>
              </a>
              <h2 className="editorial-footer-heading">
                YOUR NEXT<br />DONATION COULD<br />SAVE A LIFE
              </h2>
              <a className="editorial-footer-cta" href="#register">Become a Donor</a>
            </div>

            <div className="editorial-footer-links">
              <nav className="editorial-footer-column" aria-label="Company links">
                <h3>COMPANY</h3>
                <ul>
                  {companyLinks.map((link) => (
                    <li key={link}>
                      <a href={`#${link.toLowerCase().replaceAll(' ', '-')}`}>{link}</a>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav className="editorial-footer-column" aria-label="Social media links">
                <h3>CONNECT WITH US</h3>
                <ul className="editorial-footer-socials">
                  <li>
                    <a href="https://x.com" aria-label="BloodBridge on X">
                      <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                        <path d="M18.9 2H22l-6.78 7.75L23.2 22h-6.25l-4.9-7.44L5.55 22H2.4l7.25-8.29L1.8 2h6.4l4.43 6.78L18.9 2Zm-1.1 18h1.73L7.27 3.9H5.4L17.8 20Z" />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="https://instagram.com" aria-label="BloodBridge on Instagram">
                      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="3" y="3" width="18" height="18" rx="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="https://tiktok.com" aria-label="BloodBridge on TikTok">
                      <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                        <path d="M19.6 6.4a5.1 5.1 0 0 1-3.2-3.3A6.4 6.4 0 0 1 16.2 2h-3.8v13.6a2.8 2.8 0 1 1-2.8-2.8c.4 0 .8.1 1.1.2V9.1a7 7 0 0 0-1.1-.1 6.6 6.6 0 1 0 6.6 6.6V8.7a8.8 8.8 0 0 0 5.1 1.6V6.5a5.2 5.2 0 0 1-1.7-.1Z" />
                      </svg>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <p className="editorial-footer-copyright">© BloodBridge 2026. All Rights Reserved</p>

          <svg className="editorial-footer-wordmark" viewBox="0 0 1200 260" role="img" aria-label="BloodBridge">
            <filter id="wordmark-distress" x="-2%" y="-8%" width="104%" height="116%">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="7" result="texture" />
              <feDisplacementMap in="SourceGraphic" in2="texture" scale="5" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <text
              x="600"
              y="218"
              textAnchor="middle"
              textLength="1200"
              lengthAdjust="spacingAndGlyphs"
              filter="url(#wordmark-distress)"
            >BLOODBRIDGE</text>
          </svg>
        </div>
      </footer>
    </>
  )
}

export default Footer