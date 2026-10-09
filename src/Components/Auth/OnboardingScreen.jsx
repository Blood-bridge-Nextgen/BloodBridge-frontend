import { useRef, useState } from 'react'
import './AuthStyle.css'
import { useNavigate } from 'react-router-dom'
import logoSymbol from '../../assets/logo-symbol.png'

const roles = [
  {
    value: 'donor',
    title: 'Continue as Donor',
    description: 'Register to donate blood and save lives.',
  },
  {
    value: 'hospital',
    title: 'Hospital / Blood Bank',
    description: 'Manage requests and connect with donors.',
  },
]

const OnboardingScreen = ({ onRegister = () => {}, onSignIn = () => {} }) => {
  const [selectedRole, setSelectedRole] = useState('donor')
  const radioRefs = useRef([])
  const navigate = useNavigate()

  const handleRoleKeyDown = (event, currentIndex) => {
    let nextIndex

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % roles.length
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + roles.length) % roles.length
    } else {
      return
    }

    event.preventDefault()
    setSelectedRole(roles[nextIndex].value)
    radioRefs.current[nextIndex]?.focus()
  }

  const handleRegister = () => {
    onRegister(selectedRole)
    navigate(selectedRole === 'donor'
      ? '/DonorSignup'
      : '/HospitalSignup'
    )
  }

  const handleSignIn = () => {
    onSignIn(selectedRole)
    navigate('/SignIn')
  }

  return (
    <main className="onboarding-screen">
      <section className="onboarding-screen__content" aria-label="BloodBridge onboarding">
        <header className="onboarding-screen__brand">
          <div className="onboarding-screen__brand-row">
            <span className="onboarding-screen__logo-mark" aria-hidden="true">
              <img src={logoSymbol} alt="" />
            </span>
            <span className="onboarding-screen__wordmark">
              <span className="onboarding-screen__wordmark-blood">Blood</span><span className="onboarding-screen__wordmark-bridge">Bridge</span>
            </span>
            <span className="onboarding-screen__secured">SECURED</span>
          </div>
          <p className="onboarding-screen__tagline">SAFE. VERIFIED. LIFE-SAVING.</p>
        </header>

        <p className="onboarding-screen__prompt">Select your role to get started</p>

        <div className="onboarding-screen__roles" role="radiogroup" aria-label="Select your role">
          {roles.map((role, index) => {
            const isSelected = selectedRole === role.value

            return (
              <button
                key={role.value}
                ref={(element) => { radioRefs.current[index] = element }}
                className={`onboarding-screen__role-card${isSelected ? ' onboarding-screen__role-card--selected' : ''}`}
                type="button"
                role="radio"
                aria-checked={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setSelectedRole(role.value)}
                onKeyDown={(event) => handleRoleKeyDown(event, index)}
              >
                <span className={`onboarding-screen__role-icon${isSelected ? ' onboarding-screen__role-icon--selected' : ''}`} aria-hidden="true">
                  {role.value === 'donor' ? (
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M5 20v-1.5a7 7 0 0 1 14 0V20H5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M3.5 20.5h17v-13h-17v13Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                      <path d="M9 7.5V4h6v3.5M12 10v7m-3.5-3.5h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  )}
                </span>
                <span className="onboarding-screen__role-copy">
                  <span className="onboarding-screen__role-title">{role.title}</span>
                  <span className="onboarding-screen__role-description">{role.description}</span>
                </span>
              </button>
            )
          })}
        </div>

        <div className="onboarding-screen__actions">
          <button
            className="onboarding-screen__action-button onboarding-screen__action-button--primary"
            type="button"
            onClick={handleRegister}
          >
            Register as {selectedRole === 'donor' ? 'Donor' : 'Hospital'}
          </button>
          <button
            className="onboarding-screen__action-button onboarding-screen__action-button--secondary"
            type="button"
            onClick={handleSignIn}
          >
            Sign In
          </button>
        </div>
      </section>
    </main>
  )
}

export default OnboardingScreen