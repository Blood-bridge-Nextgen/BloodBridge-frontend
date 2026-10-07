import { useRef, useState } from 'react'
import {
  ArrowRight,
  Check,
  BellRing,
  Calendar,
  ChevronDown,
  Droplet,
  Eye,
  EyeOff,
  Info,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Shield,
  ShieldCheck,
  User,
} from 'lucide-react'
import logoSymbol from '../../assets/logo-symbol.png'
import {
  alertChannels,
  alertLanguages,
  alertRadii,
  availabilityOptions,
  bloodTypeSources,
  bloodTypes,
  donationPeriods,
  donorSteps,
  introItems,
  joiningReasons,
  nigerianStates,
  requestLevels,
} from './donorFormOptions'
import './AuthStyle.css'

const noop = () => {}

const introIcons = { BellRing, Shield, MapPin }

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
  prefix,
  rightAction,
  helper,
  onBlur,
}) => {
  const id = `donor-registration-${name}`
  const errorId = `${id}-error`

  return (
    <div className="donor-registration__field">
      <label className="donor-registration__label" htmlFor={id}>
        {label}{required && <span className="donor-registration__required"> *</span>}
      </label>
      <div className={`donor-registration__control${error ? ' donor-registration__control--error' : ''}`}>
        {prefix ? <span className="donor-registration__control-prefix">{prefix}</span> : Icon && <Icon className="donor-registration__control-icon" aria-hidden="true" />}
        {options ? (
          <>
            <select
              ref={inputRef}
              id={id}
              name={name}
              value={value}
              onChange={onChange}
              required={required}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
            >
              <option value="" disabled>{placeholder}</option>
              {options.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            <ChevronDown className="donor-registration__select-chevron" aria-hidden="true" />
          </>
        ) : (
          <>
            <input
              ref={inputRef}
              id={id}
              name={name}
              type={type}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              autoComplete={autoComplete}
              inputMode={inputMode}
              required={required}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
            />
            {rightAction}
          </>
        )}
      </div>
      {error && <p className="donor-registration__error" id={errorId} role="alert">{error}</p>}
      {helper && <p className="donor-registration__field-helper">{helper}</p>}
    </div>
  )
}


const PasswordField = ({ name, label, value, error, onChange, inputRef }) => {
  const [visible, setVisible] = useState(false)
  return (
    <FormField
      name={name}
      label={label}
      value={value}
      error={error}
      onChange={onChange}
      inputRef={inputRef}
      placeholder="At least 8 characters"
      type={visible ? 'text' : 'password'}
      autoComplete="new-password"
      rightAction={(
        <button
          className="donor-registration__password-toggle"
          type="button"
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
        </button>
      )}
    />
  )
}
const CreateDonorAccount = ({ onContinue = noop, requirePassword = true }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    state: '',
    area: '',
    coords: null,
    bloodType: '',
    lastDonation: '',
    bloodTypeSource: '',
    healthStatus: '',
    joiningReason: '',
    email: '',
    mobile: '',
    alertPreferences: {
      channels: ['SMS', 'Phone call'],
      requestLevel: 'Urgent only',
      radius: 'Within 10 km',
      availability: [],
      quietHours: {
        enabled: false,
        from: '22:00',
        to: '06:00',
        allowCritical: true,
      },
      language: 'English',
    },
    password: '',
    confirmPassword: '',
    consents: {
      terms: false,
      healthDataAndContact: false,
      marketing: false,
    },
  })
  const [errors, setErrors] = useState({})
  const [alertPreferencesOpen, setAlertPreferencesOpen] = useState(false)
  const [locationFeedback, setLocationFeedback] = useState(null)
  const fieldRefs = useRef({})

  const updateField = (name, value) => {
    setFormData((current) => {
      if (name === 'bloodType' && value === "I don't know yet") {
        return { ...current, bloodType: value, bloodTypeSource: '' }
      }
      return { ...current, [name]: value }
    })
    setErrors((current) => {
      if (!current[name]) return current
      const nextErrors = { ...current }
      delete nextErrors[name]
      return nextErrors
    })
  }

  const updateAlertPreference = (name, value) => {
    setFormData((current) => ({
      ...current,
      alertPreferences: { ...current.alertPreferences, [name]: value },
    }))
  }

  const updateQuietHours = (name, value) => {
    setFormData((current) => ({
      ...current,
      alertPreferences: {
        ...current.alertPreferences,
        quietHours: { ...current.alertPreferences.quietHours, [name]: value },
      },
    }))
  }

  const updateConsent = (name, value) => {
    setFormData((current) => ({ ...current, consents: { ...current.consents, [name]: value } }))
    setErrors((current) => {
      if (!current[name]) return current
      const nextErrors = { ...current }
      delete nextErrors[name]
      return nextErrors
    })
  }

  const updateMobile = (value) => {
    let digits = value.replace(/\D/g, '')
    if (digits.startsWith('234')) digits = digits.slice(3)
    if (digits.startsWith('0')) digits = digits.slice(1)
    digits = digits.slice(0, 10)
    updateField('mobile', digits ? `+234${digits}` : '')
  }

  const requestCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationFeedback({ type: 'neutral', text: "We couldn't get your location. You can still enter your area above." })
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setFormData((current) => ({
          ...current,
          coords: {
            latitude: Number(coords.latitude.toFixed(2)),
            longitude: Number(coords.longitude.toFixed(2)),
          },
        }))
        setLocationFeedback({ type: 'success', text: 'Location added (approximate)' })
      },
      () => setLocationFeedback({ type: 'neutral', text: "We couldn't get your location. You can still enter your area above." }),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    )
  }

  const getAge = (dateValue) => {
    if (!dateValue) return null
    const parts = dateValue.split('-').map(Number)
    if (parts.length !== 3 || parts.some(Number.isNaN)) return null
    const [year, month, day] = parts
    const birthDate = new Date(year, month - 1, day)
    if (birthDate.getFullYear() !== year || birthDate.getMonth() !== month - 1 || birthDate.getDate() !== day) return null
    const today = new Date()
    let age = today.getFullYear() - year
    if (today.getMonth() < month - 1 || (today.getMonth() === month - 1 && today.getDate() < day)) age -= 1
    return age
  }

  const age = getAge(formData.dateOfBirth)
  const showSeniorDonorNotice = age !== null && age > 65

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = {}

    if (formData.firstName.trim().length < 2) {
      nextErrors.firstName = 'Enter a first name with at least 2 characters.'
    }
    if (formData.lastName.trim().length < 2) {
      nextErrors.lastName = 'Enter a last name with at least 2 characters.'
    }

    if (!formData.dateOfBirth.trim()) {
      nextErrors.dateOfBirth = 'Enter your date of birth.'
    } else {
      if (age === null || age < 0) {
        nextErrors.dateOfBirth = 'Enter a valid date of birth.'
      } else if (age < 18) {
        nextErrors.dateOfBirth = 'You must be 18 or older to register as a donor.'
      }
    }

    if (!formData.state) nextErrors.state = 'Select your state.'
    if (formData.area.trim().length < 2) nextErrors.area = 'Enter your area or LGA.'
    if (!formData.bloodType) nextErrors.bloodType = 'Select a blood type or choose “I don’t know yet”.'
    if (!formData.lastDonation) nextErrors.lastDonation = 'Select your last donation period.'
    if (formData.bloodType && formData.bloodType !== "I don't know yet" && !formData.bloodTypeSource) {
      nextErrors.bloodTypeSource = 'Select how you know your blood type.'
    }
    if (!formData.healthStatus) nextErrors.healthStatus = 'Please select Yes or No.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (formData.mobile.replace(/\D/g, '').length !== 13) {
      nextErrors.mobile = 'Enter 10 digits after the +234 prefix.'
    }
    if (requirePassword && (formData.password.length < 8 || !/[A-Za-z]/.test(formData.password) || !/\d/.test(formData.password))) {
      nextErrors.password = 'Use at least 8 characters with a letter and a number.'
    }
    if (requirePassword && formData.password !== formData.confirmPassword) nextErrors.confirmPassword = 'Passwords must match.'
    if (!formData.consents.terms) nextErrors.terms = 'Please accept to continue.'
    if (!formData.consents.healthDataAndContact) nextErrors.healthDataAndContact = 'Please accept to continue.'

    setErrors(nextErrors)
    const firstInvalidField = Object.keys(nextErrors)[0]
    if (firstInvalidField) {
      const invalidControl = fieldRefs.current[firstInvalidField]
      invalidControl?.focus()
      invalidControl?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    const firstName = formData.firstName.trim()
    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim()
    const { radius, ...alertPreferences } = formData.alertPreferences
    const result = {
      firstName,
      lastName: formData.lastName.trim(),
      fullName,
      dateOfBirth: formData.dateOfBirth,
      state: formData.state,
      area: formData.area.trim(),
      coords: formData.coords,
      bloodType: formData.bloodType,
      bloodTypeSource: formData.bloodTypeSource || null,
      lastDonation: formData.lastDonation,
      meetsWeightAndFeelsWell: formData.healthStatus === 'yes',
      joiningReason: formData.joiningReason || null,
      email: formData.email.trim(),
      mobile: formData.mobile,
      alertPreferences: {
        ...alertPreferences,
        radiusKm: Number(radius.replace(/\D/g, '')),
        quietHours: { ...formData.alertPreferences.quietHours },
      },
      consents: { ...formData.consents },
    }
    if (requirePassword) result.password = formData.password
    onContinue(result)
  }

  const createField = (name, label, icon, placeholder, extra = {}) => (
    <FormField
      key={name}
      name={name}
      label={label}
      icon={icon}
      value={extra.value ?? formData[name]}
      onChange={extra.onChange || ((event) => updateField(name, event.target.value))}
      inputRef={(element) => { fieldRefs.current[name] = element }}
      placeholder={placeholder}
      error={errors[name]}
      onBlur={extra.onBlur}
      prefix={extra.prefix}
      helper={extra.helper}
      rightAction={extra.rightAction}
      type={extra.type}
      autoComplete={extra.autoComplete}
      inputMode={extra.inputMode}
      options={extra.options}
      required={extra.required !== false}
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
              {introItems.map(({ iconName, title, description }) => {
                const Icon = introIcons[iconName]
                return (
                <li className="donor-registration__intro-item" key={title}>
                  <span className="donor-registration__intro-icon"><Icon aria-hidden="true" /></span>
                  <span className="donor-registration__intro-item-copy">
                    <span className="donor-registration__intro-title">{title}</span>
                    <span className="donor-registration__intro-description">{description}</span>
                  </span>
                </li>
                )
              })}
            </ul>

            <aside className="donor-registration__eligibility">
              <h2 className="donor-registration__eligibility-title"><Info aria-hidden="true" /> Before you begin</h2>
              <p>Most donors are 18–65, weigh at least 50 kg (110 lb), and feel well on donation day. Final eligibility is always confirmed by the donation center.</p>
            </aside>
          </aside>

          <section className="donor-registration__card" aria-labelledby="donor-form-title">
            <ol className="donor-registration__stepper" aria-label="Sign-up progress">
              {donorSteps.map((step, index) => {
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
                  <span><h3 id="about-you-title">About you</h3><p>Use the name shown on your photo ID.</p></span>
                </div>
                <div className="donor-registration__field-grid">
                  {createField('firstName', 'First name', User, 'Enter first name', { autoComplete: 'given-name' })}
                  {createField('lastName', 'Last name', User, 'Enter last name', { autoComplete: 'family-name' })}
                  <div>
                    {createField('dateOfBirth', 'Date of birth', Calendar, '', { type: 'date', autoComplete: 'bday' })}
                    {showSeniorDonorNotice && <p className="donor-registration__dob-notice">Donors over 65 may need a doctor's approval. The donation center will confirm.</p>}
                  </div>
                  {createField('state', 'State', MapPin, 'Select state', { options: nigerianStates })}
                  <div className="donor-registration__field-full">
                    {createField('area', 'Area / LGA', MapPin, 'e.g. Ikeja', { autoComplete: 'address-level3', helper: 'Used to match you with nearby hospitals' })}
                    <button className="donor-registration__location-button" type="button" onClick={requestCurrentLocation}>
                      <MapPin aria-hidden="true" /> Use my current location
                    </button>
                    {locationFeedback && (
                      <p className={`donor-registration__location-feedback donor-registration__location-feedback--${locationFeedback.type}`} role="status">
                        {locationFeedback.type === 'success' && <Check aria-hidden="true" />}{locationFeedback.text}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <section className="donor-registration__form-section" aria-labelledby="donation-details-title">
                <div className="donor-registration__section-heading">
                  <span className="donor-registration__section-icon"><Droplet aria-hidden="true" /></span>
                  <span><h3 id="donation-details-title">Donation details</h3><p>It's okay if you don't know your blood type yet.</p></span>
                </div>
                <div className="donor-registration__field-grid">
                  {createField('bloodType', 'Blood type', Droplet, 'Select blood type', { options: bloodTypes })}
                  {createField('lastDonation', 'Last donation', Calendar, 'Select date or Never', { options: donationPeriods })}
                  {formData.bloodType && formData.bloodType !== "I don't know yet" && (
                    <div className="donor-registration__field-full">
                      {createField('bloodTypeSource', 'How do you know your blood type?', Droplet, 'Select source', {
                        options: bloodTypeSources,
                        helper: "We'll treat it as unconfirmed until a donation center verifies it.",
                      })}
                    </div>
                  )}
                </div>
                <div className={`donor-registration__health-row${errors.healthStatus ? ' donor-registration__health-row--error' : ''}`}>
                  <span className="donor-registration__health-copy">
                    <span>Do you weigh at least 50 kg (110 lb) and feel well today?</span>
                    <span>A full health screening happens at the donation center.</span>
                  </span>
                  <div
                    className="donor-registration__health-toggle"
                    role="radiogroup"
                    aria-label="Do you weigh at least 50 kg and feel well today?"
                    aria-invalid={Boolean(errors.healthStatus)}
                    aria-describedby={errors.healthStatus ? 'donor-registration-healthStatus-error' : undefined}
                  >
                    {['yes', 'no'].map((answer, index) => (
                      <button
                        className={`donor-registration__health-option${formData.healthStatus === answer ? ' donor-registration__health-option--selected' : ''}`}
                        type="button"
                        role="radio"
                        aria-checked={formData.healthStatus === answer}
                        ref={(element) => { if (index === 0) fieldRefs.current.healthStatus = element }}
                        key={answer}
                        onClick={() => updateField('healthStatus', answer)}
                        onKeyDown={(event) => {
                          if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) {
                            event.preventDefault()
                            const next = answer === 'yes' ? 'no' : 'yes'
                            updateField('healthStatus', next)
                            event.currentTarget.parentElement.querySelector(`[data-health="${next}"]`)?.focus()
                          }
                        }}
                        data-health={answer}
                      >
                        {answer === 'yes' ? 'Yes' : 'No'}
                      </button>
                    ))}
                  </div>
                </div>
                {errors.healthStatus && <p className="donor-registration__error" id="donor-registration-healthStatus-error" role="alert">{errors.healthStatus}</p>}
                {formData.healthStatus === 'no' && <p className="donor-registration__health-note">You can still register. We'll mark you as not yet eligible and let you know when you may be able to donate.</p>}
                <div className="donor-registration__optional-field">
                  {createField('joiningReason', 'Why are you joining?', Info, 'Select a reason (optional)', { options: joiningReasons, required: false })}
                </div>
              </section>

              <section className="donor-registration__form-section" aria-labelledby="contact-title">
                <div className="donor-registration__section-heading">
                  <span className="donor-registration__section-icon"><MessageSquare aria-hidden="true" /></span>
                  <span><h3 id="contact-title">How we can reach you</h3><p>Used only for account security and verified donor alerts.</p></span>
                </div>
                <div className="donor-registration__field-grid">
                  {createField('email', 'Email address', Mail, 'you@example.com', { type: 'email', autoComplete: 'email' })}
                  {createField('mobile', 'Mobile number', null, '803 555 0142', {
                    type: 'tel',
                    autoComplete: 'tel-national',
                    inputMode: 'tel',
                    prefix: '+234',
                    value: formData.mobile.replace(/^\+234/, ''),
                    onChange: (event) => updateMobile(event.target.value),
                  })}
                </div>
              </section>

              <section className="donor-registration__form-section" aria-labelledby="alert-preferences-title">
                <button
                  className="donor-registration__collapsible-heading"
                  type="button"
                  aria-expanded={alertPreferencesOpen}
                  aria-controls="donor-alert-preferences"
                  onClick={() => setAlertPreferencesOpen((open) => !open)}
                >
                  <span className="donor-registration__section-icon"><BellRing aria-hidden="true" /></span>
                  <span className="donor-registration__collapsible-copy">
                    <span className="donor-registration__collapsible-title-row"><strong id="alert-preferences-title">Alert preferences</strong><span className="donor-registration__optional-pill">Optional</span></span>
                    <span className="donor-registration__section-subtitle">Choose how and when we reach you. You can change this anytime.</span>
                  </span>
                  <ChevronDown className={`donor-registration__collapse-chevron${alertPreferencesOpen ? ' donor-registration__collapse-chevron--open' : ''}`} aria-hidden="true" />
                </button>
                <div
                  className={`donor-registration__collapsible-body${alertPreferencesOpen ? ' donor-registration__collapsible-body--open' : ''}`}
                  id="donor-alert-preferences"
                  aria-hidden={!alertPreferencesOpen}
                  inert={!alertPreferencesOpen}
                >
                  <div className="donor-registration__collapsible-inner">
                    <div className="donor-registration__preference-field">
                      <p className="donor-registration__preference-label">How should we alert you?</p>
                      <div className="donor-registration__chip-row" role="group" aria-label="Alert channels">
                        {alertChannels.map((channel) => {
                          const selected = formData.alertPreferences.channels.includes(channel)
                          return (
                            <button
                              className={`donor-registration__choice-chip${selected ? ' donor-registration__choice-chip--selected' : ''}`}
                              type="button"
                              role="checkbox"
                              aria-checked={selected}
                              key={channel}
                              onClick={() => {
                                const current = formData.alertPreferences.channels
                                if (selected && current.length === 1) return
                                updateAlertPreference('channels', selected ? current.filter((item) => item !== channel) : [...current, channel])
                              }}
                            >{channel}</button>
                          )
                        })}
                      </div>
                    </div>

                    <fieldset className="donor-registration__preference-field donor-registration__radio-fieldset">
                      <legend className="donor-registration__preference-label">Which requests should we send?</legend>
                      <div className="donor-registration__request-levels">
                        {requestLevels.map((level) => (
                          <label className={`donor-registration__request-level${formData.alertPreferences.requestLevel === level ? ' donor-registration__request-level--selected' : ''}`} key={level}>
                            <input
                              type="radio"
                              name="requestLevel"
                              value={level}
                              checked={formData.alertPreferences.requestLevel === level}
                              onChange={() => updateAlertPreference('requestLevel', level)}
                            />
                            <span>{level}</span>
                            {level === 'Urgent only' && <small>Critical and High priority</small>}
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <div className="donor-registration__field-grid donor-registration__preference-field">
                      {createField('alertRadius', 'How far should we look?', MapPin, 'Select radius', {
                        options: alertRadii,
                        required: false,
                        value: formData.alertPreferences.radius,
                        onChange: (event) => updateAlertPreference('radius', event.target.value),
                      })}
                      {createField('alertLanguage', 'Alert language', MessageSquare, 'Select language', {
                        options: alertLanguages,
                        required: false,
                        value: formData.alertPreferences.language,
                        onChange: (event) => updateAlertPreference('language', event.target.value),
                      })}
                    </div>

                    <div className="donor-registration__preference-field">
                      <p className="donor-registration__preference-label">When are you usually free?</p>
                      <div className="donor-registration__chip-row" role="group" aria-label="Usual availability">
                        {availabilityOptions.map((option) => {
                          const selected = formData.alertPreferences.availability.includes(option)
                          return (
                            <button
                              className={`donor-registration__choice-chip${selected ? ' donor-registration__choice-chip--selected' : ''}`}
                              type="button"
                              role="checkbox"
                              aria-checked={selected}
                              key={option}
                              onClick={() => updateAlertPreference('availability', selected
                                ? formData.alertPreferences.availability.filter((item) => item !== option)
                                : [...formData.alertPreferences.availability, option])}
                            >{option}</button>
                          )
                        })}
                      </div>
                      <p className="donor-registration__field-helper">Leave empty if you're flexible</p>
                    </div>

                    <div className="donor-registration__quiet-hours">
                      <label className="donor-registration__quiet-toggle-label" htmlFor="quiet-hours-toggle">Quiet hours</label>
                      <button
                        id="quiet-hours-toggle"
                        className={`donor-registration__switch${formData.alertPreferences.quietHours.enabled ? ' donor-registration__switch--on' : ''}`}
                        type="button"
                        role="switch"
                        aria-checked={formData.alertPreferences.quietHours.enabled}
                        onClick={() => updateQuietHours('enabled', !formData.alertPreferences.quietHours.enabled)}
                      ><span /></button>
                      {formData.alertPreferences.quietHours.enabled && (
                        <div className="donor-registration__quiet-details">
                          <label>From<input type="time" value={formData.alertPreferences.quietHours.from} onChange={(event) => updateQuietHours('from', event.target.value)} /></label>
                          <label>To<input type="time" value={formData.alertPreferences.quietHours.to} onChange={(event) => updateQuietHours('to', event.target.value)} /></label>
                          <label className="donor-registration__critical-checkbox"><input type="checkbox" checked={formData.alertPreferences.quietHours.allowCritical} onChange={(event) => updateQuietHours('allowCritical', event.target.checked)} /> Still send critical requests during quiet hours</label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {requirePassword && (
                <section className="donor-registration__form-section" aria-labelledby="secure-account-title">
                  <div className="donor-registration__section-heading">
                    <span className="donor-registration__section-icon"><Lock aria-hidden="true" /></span>
                    <span><h3 id="secure-account-title">Secure your account</h3><p>Create a password for your BloodBridge account.</p></span>
                  </div>
                  <div className="donor-registration__field-grid">
                    <PasswordField name="password" label="Create password" value={formData.password} error={errors.password} onChange={(event) => updateField('password', event.target.value)} inputRef={(element) => { fieldRefs.current.password = element }} />
                    <PasswordField name="confirmPassword" label="Confirm password" value={formData.confirmPassword} error={errors.confirmPassword} onChange={(event) => updateField('confirmPassword', event.target.value)} inputRef={(element) => { fieldRefs.current.confirmPassword = element }} />
                  </div>
                </section>
              )}

              <section className="donor-registration__form-section" aria-labelledby="consents-title">
                <div className="donor-registration__section-heading">
                  <span className="donor-registration__section-icon"><ShieldCheck aria-hidden="true" /></span>
                  <span><h3 id="consents-title">Consents</h3><p>Review and confirm before continuing.</p></span>
                </div>
                {/* TODO: Wording to be reviewed by legal (data protection). */}
                <div className="donor-registration__consent-list">
                  <div className="donor-registration__consent-item">
                    <label className="donor-registration__consent-label" htmlFor="consent-terms">
                      <input ref={(element) => { fieldRefs.current.terms = element }} id="consent-terms" type="checkbox" checked={formData.consents.terms} onChange={(event) => updateConsent('terms', event.target.checked)} aria-invalid={Boolean(errors.terms)} aria-describedby={errors.terms ? 'consent-terms-error' : undefined} />
                      <span>I agree to BloodBridge's <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.</span>
                    </label>
                    {errors.terms && <p className="donor-registration__error" id="consent-terms-error" role="alert">{errors.terms}</p>}
                  </div>
                  <div className="donor-registration__consent-item">
                    <label className="donor-registration__consent-label" htmlFor="consent-health-data">
                      <input ref={(element) => { fieldRefs.current.healthDataAndContact = element }} id="consent-health-data" type="checkbox" checked={formData.consents.healthDataAndContact} onChange={(event) => updateConsent('healthDataAndContact', event.target.checked)} aria-invalid={Boolean(errors.healthDataAndContact)} aria-describedby={errors.healthDataAndContact ? 'consent-health-data-error' : undefined} />
                      <span>I consent to BloodBridge using my blood group and eligibility details to match me with verified requests, and to hospitals contacting me about requests I accept.</span>
                    </label>
                    {errors.healthDataAndContact && <p className="donor-registration__error" id="consent-health-data-error" role="alert">{errors.healthDataAndContact}</p>}
                  </div>
                  <label className="donor-registration__consent-label" htmlFor="consent-marketing">
                    <input id="consent-marketing" type="checkbox" checked={formData.consents.marketing} onChange={(event) => updateConsent('marketing', event.target.checked)} />
                    <span>Send me occasional donor news and reminders. (Optional)</span>
                  </label>
                </div>
              </section>

              <button className="donor-registration__submit" type="submit">
                Continue to phone verification <ArrowRight aria-hidden="true" />
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