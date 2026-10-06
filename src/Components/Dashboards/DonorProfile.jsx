import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  CalendarCheck,
  Droplet,
  Lock,
  MapPin,
  ShieldCheck,
  User,
} from 'lucide-react'
import { FormField } from '../Auth/CreateDonorAccount'
import DonorNavbar from './DonorNavbar'
import './Dashboard.css'

const countryOptions = ['Nigeria', 'Ghana', 'Kenya', 'South Africa']
const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const requestRadiusOptions = ['Within 5km', 'Within 10km', 'Within 20km', 'Within 50km']

const DonorProfile = ({ onSave = () => {} }) => {
  const [initialData, setInitialData] = useState({
    firstName: 'John',
    lastName: 'Okafor',
    email: 'john.okafor@example.com',
    phone: '+234 803 555 0142',
    city: 'Lagos',
    country: 'Nigeria',
    bloodGroup: 'O+',
    requestRadius: 'Within 10km',
    available: true,
  })
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)
  const fieldRefs = useRef({})
  const hasChanges = Object.keys(initialData).some((key) => formData[key] !== initialData[key])
  const displayName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim() || 'Your name'
  const initials = `${formData.firstName.trim().charAt(0)}${formData.lastName.trim().charAt(0)}`.toUpperCase() || 'JO'

  useEffect(() => {
    if (!showSuccess) return undefined
    const timeoutId = window.setTimeout(() => setShowSuccess(false), 3000)
    return () => window.clearTimeout(timeoutId)
  }, [showSuccess])

  const updateField = (name, value) => {
    setFormData((current) => ({ ...current, [name]: value }))
    setErrors((current) => {
      if (!current[name]) return current
      const nextErrors = { ...current }
      delete nextErrors[name]
      return nextErrors
    })
    setShowSuccess(false)
  }

  const resetChanges = () => {
    setFormData({ ...initialData })
    setErrors({})
    setShowSuccess(false)
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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (formData.phone.replace(/\D/g, '').length < 10) {
      nextErrors.phone = 'Enter a phone number with at least 10 digits.'
    }
    if (!formData.country) nextErrors.country = 'Select a country.'
    if (!formData.bloodGroup) nextErrors.bloodGroup = 'Select a blood group.'
    if (!formData.requestRadius) nextErrors.requestRadius = 'Select a request radius.'

    setErrors(nextErrors)
    const firstInvalidField = Object.keys(nextErrors)[0]
    if (firstInvalidField) {
      fieldRefs.current[firstInvalidField]?.focus()
      return
    }

    const savedData = { ...formData }
    onSave(savedData)
    setInitialData(savedData)
    setFormData(savedData)
    setShowSuccess(true)
  }

  const renderField = (name, label, icon, placeholder, extra = {}) => (
    <div className="donor-profile__field-wrap" key={name}>
      <FormField
        name={`profile-${name}`}
        label={label}
        icon={icon}
        value={formData[name]}
        onChange={(event) => updateField(name, event.target.value)}
        inputRef={(element) => { fieldRefs.current[name] = element }}
        placeholder={placeholder}
        error={errors[name]}
        autoComplete={extra.autoComplete}
        options={extra.options}
        type={extra.type}
      />
      {extra.helper && <p className="donor-profile__field-helper">{extra.helper}</p>}
    </div>
  )

  return (
    <div className="donor-profile">
      <DonorNavbar activeLink="profile" />
      <main className="donor-profile__main">
        <div className="alignment-container">
          <nav className="donor-profile__breadcrumb" aria-label="Breadcrumb">
            <a href="/DonorDashboard"><ArrowLeft aria-hidden="true" /> Back to dashboard</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Profile</span>
          </nav>

          <header className="donor-profile__page-heading">
            <div>
              <h1>Edit Profile</h1>
              <p>Keep your profile up to date so help can reach you quickly.</p>
            </div>
            <button className="donor-profile__reset-button" type="button" onClick={resetChanges}>Reset changes</button>
          </header>

          {showSuccess && (
            <div className="donor-profile__success-banner" role="status">
              <ShieldCheck aria-hidden="true" /> Profile updated
            </div>
          )}

          <form noValidate onSubmit={handleSubmit}>
            <div className="donor-profile__layout">
              <div className="donor-profile__form-column">
                <section className="donor-profile__card" aria-labelledby="personal-details-title">
                  <div className="donor-profile__card-heading">
                    <span className="donor-profile__section-icon"><User aria-hidden="true" /></span>
                    <span>
                      <h2 id="personal-details-title">Personal details</h2>
                      <p>Your identity and contact information.</p>
                    </span>
                  </div>
                  <div className="donor-profile__divider" />
                  <div className="donor-profile__field-grid">
                    {renderField('firstName', 'First name', User, 'John', { autoComplete: 'given-name' })}
                    {renderField('lastName', 'Last name', User, 'Okafor', { autoComplete: 'family-name' })}
                    {renderField('email', 'Email address', User, 'john.okafor@example.com', { type: 'email', autoComplete: 'email' })}
                    {renderField('phone', 'Phone number', User, '+234 803 555 0142', { type: 'tel', autoComplete: 'tel', helper: 'Contact details are only shared with a hospital after you accept a request.' })}
                  </div>
                </section>

                <section className="donor-profile__card" aria-labelledby="location-details-title">
                  <div className="donor-profile__card-heading">
                    <span className="donor-profile__section-icon"><MapPin aria-hidden="true" /></span>
                    <span>
                      <h2 id="location-details-title">Location &amp; donor information</h2>
                      <p>Use these details to match you with nearby requests.</p>
                    </span>
                  </div>
                  <div className="donor-profile__divider" />
                  <div className="donor-profile__field-grid">
                    {renderField('city', 'City', MapPin, 'Lagos', { autoComplete: 'address-level2' })}
                    {renderField('country', 'Country', MapPin, 'Select country', { options: countryOptions })}
                    {renderField('bloodGroup', 'Blood group', Droplet, 'Select blood group', { options: bloodGroupOptions, helper: 'Confirmed at your donation visits.' })}
                    {renderField('requestRadius', 'Request radius', MapPin, 'Select request radius', { options: requestRadiusOptions, helper: 'How far from you we look for requests.' })}
                  </div>
                </section>

                <section className="donor-profile__card" aria-labelledby="availability-title">
                  <div className="donor-profile__card-heading">
                    <span className="donor-profile__section-icon"><CalendarCheck aria-hidden="true" /></span>
                    <span>
                      <h2 id="availability-title">Donation availability</h2>
                      <p>Let hospitals know when you're ready.</p>
                    </span>
                  </div>
                  <div className="donor-profile__divider" />
                  <div className={`donor-profile__availability${formData.available ? ' donor-profile__availability--on' : ' donor-profile__availability--off'}`}>
                    <span className="donor-profile__availability-copy">
                      <strong>{formData.available ? 'Available' : 'Unavailable'}</strong>
                      <span>{formData.available ? 'Nearby hospitals can contact you about urgent requests.' : "Hospitals won't send you new requests."}</span>
                    </span>
                    <button
                      className={`donor-profile__toggle${formData.available ? ' donor-profile__toggle--on' : ''}`}
                      type="button"
                      role="switch"
                      aria-checked={formData.available}
                      aria-label="Donor availability"
                      onClick={() => updateField('available', !formData.available)}
                    >
                      <span />
                    </button>
                  </div>
                </section>
              </div>

              <aside className="donor-profile__summary-column" aria-label="Profile summary and information">
                <section className="donor-profile__card donor-profile__summary-card" aria-labelledby="profile-summary-title">
                  <div className="donor-profile__avatar" aria-hidden="true">{initials}</div>
                  <h2 id="profile-summary-title">{displayName}</h2>
                  <p className="donor-profile__summary-subtitle">BloodBridge donor</p>
                  <div className="donor-profile__summary-chips">
                    <span className="donor-profile__summary-chip donor-profile__summary-chip--blood"><Droplet aria-hidden="true" /> Blood Group {formData.bloodGroup}</span>
                    <span className={`donor-profile__summary-chip donor-profile__summary-chip--availability${formData.available ? '' : ' donor-profile__summary-chip--unavailable'}`}>
                      <i aria-hidden="true" /> {formData.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <div className="donor-profile__summary-divider" />
                  <div className="donor-profile__summary-detail"><MapPin aria-hidden="true" /> {formData.city || 'Add your city'}, {formData.country}</div>
                  <div className="donor-profile__summary-detail"><Droplet aria-hidden="true" /> 8 donations · 24 lives potentially saved</div>
                </section>

                <section className="donor-profile__card donor-profile__info-card" aria-labelledby="profile-info-title">
                  <h2 id="profile-info-title"><ShieldCheck aria-hidden="true" /> Better details. Faster help.</h2>
                  <p>An accurate phone number and location help hospitals connect with the right donor when every minute matters.</p>
                  <p>Updating your availability won't change your donation eligibility.</p>
                </section>
                <p className="donor-profile__medical-note">Medical details are reviewed only at the donation center.</p>
              </aside>
            </div>

            <div className="donor-profile__action-bar">
              <p className="donor-profile__privacy-note"><Lock aria-hidden="true" /> Your information is kept private and secure.</p>
              <div className="donor-profile__action-buttons">
                <button className="donor-profile__cancel-button" type="button" onClick={resetChanges}>Cancel</button>
                <button className="donor-profile__save-button" type="submit" disabled={!hasChanges}>Save Changes</button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default DonorProfile
