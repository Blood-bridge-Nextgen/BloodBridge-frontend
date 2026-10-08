import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'
import {
  sendPasswordReset,
  verifyPasswordResetOtp,
} from '../../api/authApi'
import './VerifyResetOtp.css'

const DEFAULT_LENGTH = 5
const DEFAULT_EXPIRES_IN_MINUTES = 10
const DEFAULT_RESEND_COOLDOWN_SECONDS = 60

const createDigits = (length) => Array.from({ length }, () => '')

const getMaskedEmail = (email) => {
  const [localPart, domain] = email.split('@')

  if (!localPart || !domain) {
    return email
  }

  return `${localPart.charAt(0)}***@${domain}`
}

const getCountdownText = (availableAt) => {
  const secondsLeft = Math.max(0, Math.ceil((availableAt - Date.now()) / 1000))
  const minutes = Math.floor(secondsLeft / 60)
  const remainingSeconds = secondsLeft % 60

  return `Resend in ${minutes}:${String(remainingSeconds).padStart(2, '0')}`
}

const VerifyResetOtp = ({
  email,
  length = DEFAULT_LENGTH,
  expiresInMinutes = DEFAULT_EXPIRES_IN_MINUTES,
  resendCooldownSeconds = DEFAULT_RESEND_COOLDOWN_SECONDS,
  onVerified = () => {},
  onBack = () => window.history.back(),
  onChangeEmail = () => {},
  onBackToSignIn = () => {},
}) => {
  const [digits, setDigits] = useState(() => createDigits(length))
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [resendAvailableAt, setResendAvailableAt] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isResendVisible, setIsResendVisible] = useState(false)

  const inputRefs = useRef([])
  const successMessageTimerRef = useRef(null)
  const verificationRequestRef = useRef(false)
  const isMountedRef = useRef(true)

  const maskedEmail = useMemo(() => getMaskedEmail(email), [email])
  const isCodeComplete = digits.every((digit) => digit !== '')
  const isDisabled = status === 'verifying' || status === 'locked'
  const isResendDisabled = resendAvailableAt > currentTime || status === 'verifying'
  const isErrorVisible = status === 'error' || status === 'locked'

  const focusInput = useCallback((index) => {
    const input = inputRefs.current[index]

    if (!input) {
      return
    }

    input.focus()
    input.select()
  }, [])

  useEffect(() => {
    if (!email) {
      onBack()
      return
    }

    const timer = window.setTimeout(() => focusInput(0), 0)

    return () => window.clearTimeout(timer)
  }, [email, focusInput, onBack])

  useEffect(() => {
    if (!email) {
      return undefined
    }

    const nextAvailableAt = Date.now() + resendCooldownSeconds * 1000
    setResendAvailableAt(nextAvailableAt)
    setCurrentTime(Date.now())
    setIsResendVisible(false)

    return undefined
  }, [email, resendCooldownSeconds])

  useEffect(() => {
    if (!email || resendAvailableAt === 0) {
      return undefined
    }

    const updateCountdown = () => {
      const nextTime = Date.now()
      setCurrentTime(nextTime)
      setIsResendVisible(nextTime >= resendAvailableAt)
    }

    updateCountdown()
    const interval = window.setInterval(updateCountdown, 1000)

    return () => window.clearInterval(interval)
  }, [email, resendAvailableAt])

  useEffect(() => {
    return () => {
      isMountedRef.current = false
      window.clearTimeout(successMessageTimerRef.current)
    }
  }, [])

  const updateDigits = (nextDigits) => {
    setDigits(nextDigits)
    if (status === 'error' || status === 'locked') {
      setStatus('idle')
      setMessage('')
    }
  }

  const fillFromValue = (value, startIndex) => {
    const nextDigits = [...digits]
    const cleanDigits = value.replace(/\D/g, '').slice(0, length)

    cleanDigits.split('').forEach((digit, index) => {
      nextDigits[startIndex + index] = digit
    })

    updateDigits(nextDigits)

    const nextIndex = Math.min(startIndex + cleanDigits.length, length - 1)
    window.setTimeout(() => focusInput(nextIndex), 0)
  }

  const handleDigitChange = (index, value) => {
    const onlyDigits = value.replace(/\D/g, '')

    if (onlyDigits.length > 1) {
      fillFromValue(onlyDigits, index)
      return
    }

    const nextDigits = [...digits]
    nextDigits[index] = onlyDigits
    updateDigits(nextDigits)

    if (onlyDigits && index < length - 1) {
      focusInput(index + 1)
    }
  }

  const handleKeyDown = (event, index) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      focusInput(Math.max(0, index - 1))
      return
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      focusInput(Math.min(length - 1, index + 1))
      return
    }

    if (event.key === 'Home') {
      event.preventDefault()
      focusInput(0)
      return
    }

    if (event.key === 'End') {
      event.preventDefault()
      focusInput(length - 1)
      return
    }

    if (event.key === 'Backspace' && digits[index] === '' && index > 0) {
      event.preventDefault()
      const nextDigits = [...digits]
      nextDigits[index - 1] = ''
      updateDigits(nextDigits)
      focusInput(index - 1)
    }
  }

  const handlePaste = (event) => {
    event.preventDefault()
    fillFromValue(event.clipboardData?.getData('text') || '', 0)
  }

  const completeVerification = useCallback(async (code) => {
    if (!email || status === 'verifying' || status === 'locked') {
      return
    }

    verificationRequestRef.current = true
    setStatus('verifying')
    setMessage('')

    try {
      const data = await verifyPasswordResetOtp(email, code)
      onVerified(data)
    } catch (error) {
      const nextStatus = error?.status === 429 ? 'locked' : 'error'
      const fallbackMessage = nextStatus === 'locked'
        ? 'Too many attempts. Please wait a few minutes and try again.'
        : 'That code is incorrect or has expired. Please try again.'

      if (isMountedRef.current) {
        setStatus(nextStatus)
        setMessage(error instanceof Error && error.message ? error.message : fallbackMessage)
        setDigits(createDigits(length))
        window.setTimeout(() => focusInput(0), 0)
      }
    } finally {
      if (isMountedRef.current) {
        verificationRequestRef.current = false
      }
    }
  }, [email, focusInput, length, onVerified, status])

  useEffect(() => {
    if (!isCodeComplete || status !== 'idle' || !email || verificationRequestRef.current) {
      return
    }

    completeVerification(digits.join(''))
  }, [completeVerification, digits, email, isCodeComplete, status])

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!isCodeComplete || isDisabled) {
      return
    }

    completeVerification(digits.join(''))
  }

  const handleResend = async () => {
    if (isResendDisabled || isDisabled || status === 'locked') {
      return
    }

    setStatus('idle')
    setMessage('')

    try {
      await sendPasswordReset(email)
      setDigits(createDigits(length))
      setResendAvailableAt(Date.now() + resendCooldownSeconds * 1000)
      setIsResendVisible(false)
      setMessage('A new code has been sent to your email.')
      successMessageTimerRef.current = window.setTimeout(() => {
        setMessage('')
      }, 4000)
      window.setTimeout(() => focusInput(0), 0)
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error && error.message
        ? error.message
        : 'Unable to resend the code. Please try again.')
    }
  }

  const handleDifferentEmail = () => {
    onChangeEmail()
  }

  const handleBackToSignIn = () => {
    onBackToSignIn()
  }

  if (!email) {
    return null
  }

  return (
    <main className="verify-reset-otp">
      <section className="verify-reset-otp__card">
        <header className="verify-reset-otp__header">
          <button
            className="verify-reset-otp__back-button"
            type="button"
            aria-label="Go back"
            onClick={onBack}
            disabled={status === 'verifying'}
          >
            <ArrowLeft aria-hidden="true" />
          </button>
          <h1 className="verify-reset-otp__title">Verify Code</h1>
        </header>

        <div className="verify-reset-otp__intro">
          <p>
            We sent a 5-digit code to <strong>{maskedEmail}</strong>. Enter it below to reset your password.
          </p>
        </div>

        <form className="verify-reset-otp__form" noValidate onSubmit={handleSubmit}>
          <div className="verify-reset-otp__field">
            <div
              className="verify-reset-otp__code-group"
              role="group"
              aria-label="Verification code"
            >
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element
                  }}
                  className={`verify-reset-otp__code-input${
                    status === 'error' || status === 'locked' ? ' verify-reset-otp__code-input--error' : ''
                  }${digit ? ' verify-reset-otp__code-input--filled' : ''}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete={index === 0 ? 'one-time-code' : 'off'}
                  value={digit}
                  aria-label={`Digit ${index + 1} of ${length}`}
                  aria-invalid={isErrorVisible}
                  onChange={(event) => handleDigitChange(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  onPaste={handlePaste}
                  onFocus={(event) => event.target.select()}
                  disabled={isDisabled}
                />
              ))}
            </div>

            <p className="verify-reset-otp__hint">
              The code expires in {expiresInMinutes} minutes.
            </p>

            {status === 'error' && (
              <div className="verify-reset-otp__message verify-reset-otp__message--error" role="alert">
                <AlertCircle aria-hidden="true" />
                <span>{message}</span>
              </div>
            )}

            {status === 'locked' && (
              <div className="verify-reset-otp__message verify-reset-otp__message--error" role="alert">
                <AlertCircle aria-hidden="true" />
                <span>{message}</span>
              </div>
            )}

            {status === 'idle' && message && (
              <div className="verify-reset-otp__message verify-reset-otp__message--success" role="status">
                <CheckCircle2 aria-hidden="true" />
                <span>{message}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="verify-reset-otp__submit-button"
            disabled={!isCodeComplete || isDisabled}
          >
            {status === 'verifying' ? (
              <>
                <Loader2 className="verify-reset-otp__spinner" aria-hidden="true" />
                <span>Verifying...</span>
              </>
            ) : (
              'Verify Code'
            )}
          </button>
        </form>

        <div className="verify-reset-otp__resend">
          {isResendVisible ? (
            <p className="verify-reset-otp__resend-text">
              Didn&apos;t get the code?{' '}
              <button
                type="button"
                className="verify-reset-otp__resend-button"
                onClick={handleResend}
                disabled={isResendDisabled || status === 'verifying'}
              >
                {status === 'idle' ? 'Resend code' : 'Sending...'}
              </button>
            </p>
          ) : (
            <p className="verify-reset-otp__resend-text verify-reset-otp__resend-text--cooldown">
              {getCountdownText(resendAvailableAt)}
            </p>
          )}
        </div>

        <div className="verify-reset-otp__links">
          <button
            type="button"
            className="verify-reset-otp__link"
            onClick={handleDifferentEmail}
            disabled={isDisabled}
          >
            Use a different email
          </button>

          <button
            type="button"
            className="verify-reset-otp__link"
            onClick={handleBackToSignIn}
            disabled={isDisabled}
          >
            Back to Sign In
          </button>
        </div>
      </section>
    </main>
  )
}

export default VerifyResetOtp
