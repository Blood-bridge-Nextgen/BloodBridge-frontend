import { useRef, useState } from 'react'
import {
  ArrowRight,
  BellRing,
  Calendar,
  ChevronDown,
  Droplet,
  Info,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Shield,
  ShieldCheck,
  User,
} from 'lucide-react'
import logoSymbol from '../../assets/logo-symbol.png'
import './AuthStyle.css'

const noop = () => {}

const introItems = [
  {
    icon: BellRing,
    title: 'Alerts that matter',
    description: 'Choose how and when nearby verified requests reach you.',
  },
  {
    icon: Shield,
    title: 'Your choice, every time',
    description: 'Registering never obligates you to donate or share medical records.',
  },
  {
    icon: MapPin,
    title: 'Local impact',
    description: 'Your approximate location helps us connect you with nearby hospitals.',
  },
]

const steps = ['Donor details', 'Verify identity', "You're ready"]
const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', "I don't know yet"]
const donationPeriods = [
  'Never donated',
  'Less than 3 months ago',
  '3–6 months ago',
  '6–12 months ago',
  'Over 12 months ago',
]

export const FormField = ({
  name,
  label,
  icon: Icon,
  value,
  onChange,
  inputRef,
  placeholder,
  error,
  required = false,
  options,
  type = 'text',
  autoComplete,
  inputMode,
}) => {
  const errorId = `${name}-error`

  return (
    <div className="donor-registration__field">
      <label className="donor-registration__label" htmlFor={name}>
        {label}{required && <span className="donor-registration__required"> *</span>}
      </label>
      <div className={`donor-registration__control${error ? ' donor-registration__control--error' : ''}`}>
        <Icon className="donor-registration__control-icon" aria-hidden="true" />
        {options ? (
          <>
            <select
              ref={inputRef}
              id={name}
              name={name}
              value={value}
              onChange={onChange}
              required={required}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
            >
              <option value="" disabled>{placeholder}</option>
              {options.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <ChevronDown className="donor-registration__select-chevron" aria-hidden="true" />
          </>
        ) : (
          <input
            ref={inputRef}
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete={autoComplete}
            inputMode={inputMode}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
          />
        )}
      </div>
      {error && <p className="donor-registration__error" id={errorId} role="alert">{error}</p>}
    </div>
  )
}

const CreateDonorAccount = ({ onContinue = noop }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    zipCode: '',
    bloodType: '',
    lastDonation: '',
    healthStatus: 'yes',
    email: '',
    mobile: '',
    consent: false,
  })
  const [errors, setErrors] = useState({})
  const fieldRefs = useRef({})

  const updateField = (name, value) => {
    setFormData((current) => ({ ...current, [name]: value }))
    setErrors((current) => {
      if (!current[name]) return current
      const nextErrors = { ...current }
      delete nextErrors[name]
      return nextErrors
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = {}

    if (formData.firstName.trim().length < 2) {
      nextErrors.firstName = 'Enter a first name with at least 2 characters.'
    }
    if (formData.lastName.trim().length < 2) {
      nextErrors.lastName = 'Enter a last name with at least 2 characters.'
    }

    const birthDateMatch = formData.dateOfBirth.match(/^(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{4})$/)
    if (!formData.dateOfBirth.trim()) {
      nextErrors.dateOfBirth = 'Enter your date of birth.'
    } else if (!birthDateMatch) {
      nextErrors.dateOfBirth = 'Use the format MM / DD / YYYY.'
    } else {
      const [, monthText, dayText, yearText] = birthDateMatch
      const month = Number(monthText)
      const day = Number(dayText)
      const year = Number(yearText)
      const birthDate = new Date(year, month - 1, day)
      const today = new Date()
      const isValidDate = birthDate.getFullYear() === year
        && birthDate.getMonth() === month - 1
        && birthDate.getDate() === day
        && birthDate <= today

      if (!isValidDate) {
        nextErrors.dateOfBirth = 'Enter a valid date of birth.'
      } else {
        let age = today.getFullYear() - year
        if (today.getMonth() < month - 1 || (today.getMonth() === month - 1 && today.getDate() < day)) {
          age -= 1
        }
        if (age < 18) nextErrors.dateOfBirth = 'You must be at least 18 to register as a donor.'
      }
    }

    if (!/^\d{5}$/.test(formData.zipCode.trim())) {
      nextErrors.zipCode = 'Enter a valid 5-digit ZIP code.'
    }
    if (!formData.bloodType) nextErrors.bloodType = 'Select a blood type or choose “I don’t know yet”.'
    if (!formData.lastDonation) nextErrors.lastDonation = 'Select your last donation period.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (formData.mobile.replace(/\D/g, '').length < 10) {
      nextErrors.mobile = 'Enter a mobile number with at least 10 digits.'
    }
    if (!formData.consent) nextErrors.consent = 'Consent is required to continue.'

    setErrors(nextErrors)
    const firstInvalidField = Object.keys(nextErrors)[0]
    if (firstInvalidField) {
      fieldRefs.current[firstInvalidField]?.focus()
      return
    }

    onContinue(formData)
  }

  const createField = (name, label, icon, placeholder, extra = {}) => (
    <FormField
      key={name}
      name={name}
      label={label}
      icon={icon}
      value={formData[name]}
      onChange={(event) => updateField(name, event.target.value)}
      inputRef={(element) => { fieldRefs.current[name] = element }}
      placeholder={placeholder}
      error={errors[name]}
      required
      {...extra}
    />
  )

  return (
    <div className="donor-registration">
      <header className="donor-registration__header">
        <div className="alignment-container donor-registration__header-inner">
          <a className="donor-registration__brand" href="/" aria-label="BloodBridge home">
            <img className="donor-registration__brand-icon" src={logoSymbol} alt="" />
            <span className="donor-registration__wordmark"><span>Blood</span><span>Bridge</span></span>
            <span className="donor-registration__secured">SECURED</span>
          </a>
          <div className="donor-registration__header-meta">
            <span className="donor-registration__privacy">
              <ShieldCheck aria-hidden="true" />
              Your information is encrypted and private
            </span>
            <a className="donor-registration__help" href="tel:8005550199">Need help? (800) 555-0199</a>
          </div>
        </div>
      </header>

      <main className="donor-registration__main">
        <div className="alignment-container donor-registration__main-inner">
          <aside className="donor-registration__intro">
            <span className="donor-registration__verified-badge">
              <ShieldCheck aria-hidden="true" /> VERIFIED DONOR NETWORK
            </span>
            <h1 className="donor-registration__headline">A few details can start something life-saving.</h1>
            <p className="donor-registration__intro-copy">
              Create your secure donor profile in about 3 minutes. We'll only contact you when a verified need matches your blood type and location.
            </p>

            <ul className="donor-registration__intro-list">
              {introItems.map(({ icon: Icon, title, description }) => (
                <li className="donor-registration__intro-item" key={title}>
                  <span className="donor-registration__intro-icon"><Icon aria-hidden="true" /></span>
                  <span className="donor-registration__intro-item-copy">
                    <span className="donor-registration__intro-title">{title}</span>
                    <span className="donor-registration__intro-description">{description}</span>
                  </span>
                </li>
              ))}
            </ul>

            <aside className="donor-registration__eligibility">
              <h2 className="donor-registration__eligibility-title"><Info aria-hidden="true" /> Before you begin</h2>
              <p>Most donors are 18–65, weigh at least 110 lb, and feel well on donation day. Final eligibility is always confirmed by the donation center.</p>
            </aside>
          </aside>

          <section className="donor-registration__card" aria-labelledby="donor-form-title">
            <ol className="donor-registration__stepper" aria-label="Sign-up progress">
              {steps.map((step, index) => {
                const active = index === 0
                return (
                  <li
                    className={`donor-registration__step${active ? ' donor-registration__step--active' : ''}`}
                    aria-current={active ? 'step' : undefined}
                    key={step}
                  >
                    <span className="donor-registration__step-number">{String(index + 1).padStart(2, '0')}</span>
                    <span className="donor-registration__step-label">{step}</span>
                  </li>
                )
              })}
            </ol>

            <div className="donor-registration__form-heading">
              <h2 id="donor-form-title">Create your donor profile</h2>
              <p>Tell us the essentials so we can match you safely. Fields marked * are required.</p>
            </div>

            <form noValidate onSubmit={handleSubmit}>
              <section className="donor-registration__form-section" aria-labelledby="about-you-title">
                <div className="donor-registration__section-heading">
                  <span className="donor-registration__section-icon"><User aria-hidden="true" /></span>
                  <span>
                    <h3 id="about-you-title">About you</h3>
                    <p>Use the name shown on your photo ID.</p>
                  </span>
                </div>
                <div className="donor-registration__field-grid">
                  {createField('firstName', 'First name', User, 'Enter first name', { autoComplete: 'given-name' })}
                  {createField('lastName', 'Last name', User, 'Enter last name', { autoComplete: 'family-name' })}
                  {createField('dateOfBirth', 'Date of birth', Calendar, 'MM / DD / YYYY', { inputMode: 'numeric' })}
                  {createField('zipCode', 'ZIP code', MapPin, 'e.g. 10001', { autoComplete: 'postal-code', inputMode: 'numeric' })}
                </div>
              </section>

              <section className="donor-registration__form-section" aria-labelledby="donation-details-title">
                <div className="donor-registration__section-heading">
                  <span className="donor-registration__section-icon"><Droplet aria-hidden="true" /></span>
                  <span>
                    <h3 id="donation-details-title">Donation details</h3>
                    <p>It's okay if you don't know your blood type yet.</p>
                  </span>
                </div>
                <div className="donor-registration__field-grid">
                  {createField('bloodType', 'Blood type', Droplet, 'Select blood type', { options: bloodTypes })}
                  {createField('lastDonation', 'Last donation', Calendar, 'Select date or Never', { options: donationPeriods })}
                </div>
                <div className="donor-registration__health-row">
                  <span className="donor-registration__health-copy">
                    <span>Are you at least 18 and currently feeling well?</span>
                    <span>You'll complete a full health screening at the donation center.</span>
                  </span>
                  <div className="donor-registration__health-toggle" role="radiogroup" aria-label="Are you at least 18 and feeling well?">
                    {['yes', 'no'].map((answer) => (
                      <button
                        className={`donor-registration__health-option${formData.healthStatus === answer ? ' donor-registration__health-option--selected' : ''}`}
                        type="button"
                        role="radio"
                        aria-checked={formData.healthStatus === answer}
                        key={answer}
                        onClick={() => updateField('healthStatus', answer)}
                      >
                        {answer === 'yes' ? 'Yes' : 'No'}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section className="donor-registration__form-section" aria-labelledby="contact-title">
                <div className="donor-registration__section-heading">
                  <span className="donor-registration__section-icon"><MessageSquare aria-hidden="true" /></span>
                  <span>
                    <h3 id="contact-title">How we can reach you</h3>
                    <p>Used only for account security and verified donor alerts.</p>
                  </span>
                </div>
                <div className="donor-registration__field-grid">
                  {createField('email', 'Email address', Mail, 'you@example.com', { type: 'email', autoComplete: 'email' })}
                  {createField('mobile', 'Mobile number', Phone, '(555) 000-0000', { type: 'tel', autoComplete: 'tel', inputMode: 'tel' })}
                </div>
              </section>

              <div className="donor-registration__consent-block">
                <label className="donor-registration__consent-label" htmlFor="consent">
                  <input
                    ref={(element) => { fieldRefs.current.consent = element }}
                    id="consent"
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(event) => updateField('consent', event.target.checked)}
                    aria-invalid={Boolean(errors.consent)}
                    aria-describedby={errors.consent ? 'consent-error' : undefined}
                  />
                  <span>
                    I agree to BloodBridge's <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>, and consent to receive essential account and verified blood request messages. Message rates may apply.
                  </span>
                </label>
                {errors.consent && <p className="donor-registration__error" id="consent-error" role="alert">{errors.consent}</p>}
              </div>

              <button className="donor-registration__submit" type="submit">
                Continue to identity verification <ArrowRight aria-hidden="true" />
              </button>
              <p className="donor-registration__security-note"><Lock aria-hidden="true" /> 256-bit encrypted • Your health information is never sold</p>
            </form>
          </section>
        </div>
      </main>

      <footer className="donor-registration__footer">
        <div className="alignment-container donor-registration__footer-inner">
          <div className="donor-registration__footer-brand">
            <a className="donor-registration__footer-logo" href="/" aria-label="BloodBridge home">
              <img src={logoSymbol} alt="" />
              <span><span>Blood</span><span>Bridge</span></span>
            </a>
            <span className="donor-registration__copyright">© 2026 BloodBridge Coordination Network</span>
          </div>
          <div className="donor-registration__footer-meta">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <span className="donor-registration__ssl-badge">SYSTEMS ENCRYPTED [SSL]</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default CreateDonorAccount