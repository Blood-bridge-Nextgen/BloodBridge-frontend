const testimonials = [
  {
    quote: 'BloodBridge has transformed how we handle emergency dispatch. During a localized pediatric surgery crisis, the direct match pipeline cut our patient wait times by over 45 minutes.',
    name: 'Dr. Amanda Bennett',
    role: 'Chief of Emergency Services',
    organization: 'Metropolitan Medical Center',
  },
  {
    quote: 'The verification protocol on blood requests saves our staff hours of phone coordination. Knowing that each broadcast is medically audited allows us to assign resources with total confidence.',
    name: 'Robert Vance, RN',
    role: 'Head of Nursing Operations',
    organization: 'St. Jude General Hospital',
  },
  {
    quote: "Managing regional deficits became immensely easier. Integration with BloodBridge's live database gave our network of blood banks a 100% accurate visual representation of regional supply levels.",
    name: 'Dr. Cynthia Cole',
    role: 'Clinical Director of Hematology',
    organization: 'State Blood Resource Network',
  },
]

function Trust() {
  return (
    <section className="trust-section" aria-labelledby="trust-section__title">
      <div className="alignment-container">
        <header className="trust-section__header">
          <p className="trust-section__badge">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 14s5-2.5 5-7V3.5L8 1.8 3 3.5V7c0 4.5 5 7 5 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="m5.8 7.8 1.5 1.5 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            CLINICAL COMPLIANCE
          </p>
          <h2 className="trust-section__title" id="trust-section__title">
            Trusted by Healthcare Providers
          </h2>
          <p className="trust-section__subtitle">
            Proven, audited implementation stories from leading medical administrators and hospital directors.
          </p>
        </header>

        <div className="trust-section__grid">
          {testimonials.map(({ quote, name, role, organization }) => (
            <article className="trust-section__card" key={name}>
              <svg className="trust-section__quote-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M10 11H5.5A1.5 1.5 0 0 1 4 9.5v-4A1.5 1.5 0 0 1 5.5 4H9a1 1 0 0 1 1 1v6Zm10 0h-4.5A1.5 1.5 0 0 1 14 9.5v-4A1.5 1.5 0 0 1 15.5 4H19a1 1 0 0 1 1 1v6ZM4 11v1a7 7 0 0 0 7 7m3-8v1a7 7 0 0 0 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <blockquote className="trust-section__quote">
                &quot;{quote}&quot;
              </blockquote>
              <footer className="trust-section__author">
                <p className="trust-section__name">{name}</p>
                <p className="trust-section__role">
                  {role} <span aria-hidden="true">—</span> <strong>{organization}</strong>
                </p>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Trust