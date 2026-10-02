const footerColumns = [
  {
    title: 'Platform',
    links: ['How It Works', 'Medical Triage', 'Hospital Portal', 'Inventory Tracking'],
  },
  {
    title: 'Resources',
    links: ['Clinical Guide', 'Donor Safety', 'API Access', 'Status Updates'],
  },
  {
    title: 'Company',
    links: ['About Us', 'Annual Reports', 'Newsroom', 'Contact Team'],
  },
  {
    title: 'Legal',
    links: ['HIPAA Compliance', 'Privacy Policy', 'Terms of Service', 'Auditing Logs'],
  },
]

const date = new Date();

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
        <div className="site-footer-container alignment-container">
          <div className="footer-grid">
            <section className="footer-brand" aria-label="BloodBridge contact information">
              <a className="footer-brand-logo" href="#top" aria-label="BloodBridge home">
                <span className="footer-brand-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21s-8-4.6-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.4-8 11-8 11Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                    <path d="M8.5 12h2l1-2 1.5 4 1-2h1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>Blood<span>Bridge</span></span>
              </a>
              <p className="footer-brand-description">
                Securing safe blood supplies through Direct-to-Donor medical matching, direct hospital system integration, and advanced logistics protocols.
              </p>
              <p className="footer-contact">
                Hospital Integration Hotline: <a href="tel:8005550199">(800) 555-0199</a>
              </p>
              <p className="footer-support">Support: medical@bloodbridge.org</p>
            </section>

            {footerColumns.map(({ title, links }) => (
              <nav className="footer-link-column" aria-label={`${title} links`} key={title}>
                <h3>{title}</h3>
                <ul className="footer-links">
                  {links.map((link) => (
                    <li key={link}>
                      <a href={`#${link.toLowerCase().replaceAll(' ', '-')}`}>{link}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <hr className="footer-divider" />

          <div className="footer-bottom">
            <p>© {date.getFullYear()} BloodBridge Coordination Network. All rights reserved.</p>
            <div className="footer-bottom-meta">
              <p>Secured Network HIPAA Certified</p>
              <span className="footer-security-badge">SYSTEMS ENCRYPTED [SSL]</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer