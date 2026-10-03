const features = [
  {
    title: 'Emergency Broadcasts',
    description: 'Instantly coordinate matches with active local donors within a 5-mile hospital radius during emergencies.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="m9 9 6 6m0-6-6 6" />
      </svg>
    ),
  },
  {
    title: 'Intelligent Match Triage',
    description: 'Precise algorithm matches recipient antibodies and antigens with verified healthy donors in real time.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="6" cy="6" r="2" />
        <circle cx="18" cy="6" r="2" />
        <circle cx="12" cy="18" r="2" />
        <path d="M8 6h4a4 4 0 0 1 4 4v0m-8-2 3 3m5-1-3 3" />
      </svg>
    ),
  },
  {
    title: 'Hospital Inventory Portal',
    description: 'Direct, integrated dashboard access for healthcare providers to coordinate critical, on-demand supplies.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
      </svg>
    ),
  },
  {
    title: 'Direct Notification Alerts',
    description: 'Robust automated SMS and email dispatch protocols trigger immediately when urgent blood type is required.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 4h4m-2-2v4m-3 8h6" />
      </svg>
    ),
  },
  {
    title: 'Donor History Passport',
    description: 'Digitally certified, HIPAA-secure logging of previous donations, current screening stats, and schedules.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Geolocated Search System',
    description: 'Dynamic mapping showing certified hospital nodes, state-run blood banks, and active donor cluster hubs.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
  },
  {
    title: 'Live Stock Level Indicators',
    description: 'Continuous, transparent visual tracking of real-time inventory reserves at affiliated local banks.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 3v18h18M7 14l4-4 4 3 6-7m-5 0h5v5" />
      </svg>
    ),
  },
  {
    title: 'Advanced Audit Analytics',
    description: 'Enterprise reporting suite, user-access compliance controls, automated activity logs for security protocols.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="4" y="11" width="16" height="11" rx="2" />
        <path d="M8 11V7a4 4 0 1 1 8 0v4m-4 4v3" />
      </svg>
    ),
  },
]

function Features() {
  return (
    <section className="feature-section" aria-labelledby="feature-section__title">
      <div className="alignment-container">
        <header className="feature-section__header">
          <p className="feature-section__badge">
            <span className="feature-section__badge-dot" aria-hidden="true" />
            CORE TECHNOLOGY
          </p>
          <h2 className="feature-section__title" id="feature-section__title">
            Comprehensive Platform Features
          </h2>
          <p className="feature-section__subtitle">
            Clinical-grade tools developed to resolve communication and logistical friction points in critical patient care.
          </p>
        </header>

        <ul className="feature-section__grid">
          {features.map(({ title, description, icon }) => (
            <li className="feature-section__card" key={title}>
              <span className="feature-section__icon-box">{icon}</span>
              <h3 className="feature-section__card-title">{title}</h3>
              <p className="feature-section__card-description">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Features