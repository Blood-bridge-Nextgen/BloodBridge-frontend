import { useRef, useState } from 'react'
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react'
import './ResetPassword.css'

const noop = () => {}

const Field = ({ id, label, error, children }) => (
  <div className="reset-password__field">
    <label className="reset-password__label" htmlFor={id}>{label}</label>
    <div className={`reset-password__control${error ? ' reset-password__control--error' : ''}`}>
      {children}
    </div>
    {error && <p className="reset-password__field-error" id={`${id}-error`} role="alert">{error}</p>}
  </div>
)

const ResetPassword = ({
  onBack = () => window.history.back(),
  onBackToSignIn = noop,
  onSubmit = noop,
  onSuccess = noop,
}) => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('idle')
  const [requestError, setRequestError] = useState('')
  const inputRef = useRef(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (status === 'sending') return

    const trimmedEmail = email.trim()
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)

    if (!isValidEmail) {
      setError('Enter a valid email address.')
      setRequestError('')
      inputRef.current?.focus()
      return
    }

    setError('')
    setRequestError('')
    setStatus('sending')

    try {
      await onSubmit(trimmedEmail)
      onSuccess(trimmedEmail)
    } catch (requestFailure) {
      setStatus('failed')
      setRequestError(requestFailure instanceof Error
        ? requestFailure.message
        : 'Unable to send the reset code. Please try again.')
    }
  }

  const handleEmailChange = (value) => {
    setEmail(value)
    if (error) setError('')
    if (requestError) setRequestError('')
  }

  return (
    <main className="reset-password">
      <div className="reset-password__shell">
        <header className="reset-password__header">
          <button className="reset-password__back-button" type="button" aria-label="Go back" onClick={onBack}>
            <ArrowLeft aria-hidden="true" />
          </button>
          <h1 className="reset-password__title">Reset Password</h1>
        </header>

        <p className="reset-password__intro">
          Enter the email address associated with your account. We&apos;ll send you a 5-digit code to reset your password.
        </p>

        {requestError && (
          <div className="reset-password__banner" role="alert">
            <AlertCircle aria-hidden="true" />
            <span>{requestError}</span>
          </div>
        )}

        <form className="reset-password__form" noValidate onSubmit={handleSubmit}>
          <Field id="reset-password-email" label="Email Address" error={error}>
            <input
              ref={inputRef}
              id="reset-password-email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="your-email@example.com"
              value={email}
              onChange={(event) => handleEmailChange(event.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'reset-password-email-error' : undefined}
              autoFocus={window.innerWidth >= 768}
            />
          </Field>

          <button className="reset-password__submit" type="submit" disabled={status === 'sending'}>
            {status === 'sending' && <Loader2 className="reset-password__loader" aria-hidden="true" />}
            {status === 'sending' ? 'Sending...' : 'Send Reset Code'}
          </button>
        </form>

        <button className="reset-password__back-link" type="button" onClick={onBackToSignIn}>
          Back to Sign In
        </button>
      </div>
    </main>
  )
}

export default ResetPassword
