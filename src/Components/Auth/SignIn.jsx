import { useRef, useState } from 'react'
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react'
import './AuthStyle.css'
import { useNavigate } from 'react-router-dom'
import { signIn } from '../../api/authApi'

const noop = () => { }

const Field = ({ id, label, error, children }) => (
    <div className="sign-in__field">
        <label className="sign-in__label" htmlFor={id}>{label}</label>
        <div className={`sign-in__control${error ? ' sign-in__control--error' : ''}`}>
            {children}
        </div>
        {error && <p className="sign-in__field-error" id={`${id}-error`} role="alert">{error}</p>}
    </div>
)

const SignIn = ({ onSubmit = noop, onForgotPassword = noop, onCreateAccount = noop }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    })
    const [errors, setErrors] = useState({})
    const [authError, setAuthError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [passwordVisible, setPasswordVisible] = useState(false)
    const fieldRefs = useRef({})

    const updateField = (name, value) => {
        setFormData((current) => ({ ...current, [name]: value }))
        setErrors((current) => {
            if (!current[name]) return current
            const nextErrors = { ...current }
            delete nextErrors[name]
            return nextErrors
        })
        setAuthError('')
    }

    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (isSubmitting) return

        const nextErrors = {}
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            nextErrors.email = 'Enter a valid email address.'
        }
        if (!formData.password) nextErrors.password = 'Enter your password.'

        setErrors(nextErrors)
        const firstInvalidField = Object.keys(nextErrors)[0]
        if (firstInvalidField) {
            fieldRefs.current[firstInvalidField]?.focus()
            return
        }

        setIsSubmitting(true)
        setAuthError('')
        try {
            await onSubmit({
                email: formData.email.trim(),
                password: formData.password,
                rememberMe: formData.rememberMe,
            })
        } catch (error) {
            setAuthError(error instanceof Error ? error.message : 'Unable to sign in. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="sign-in">
            <section className="sign-in__card" aria-label="Sign in to BloodBridge">
                <div className="sign-in__brand" aria-label="BloodBridge secured">
                    <span className="sign-in__logo-mark" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M12 3.5 5.5 10a6.5 6.5 0 1 0 13 0L12 3.5Z" fill="currentColor" />
                            <path d="M8.5 12.5c.7 1.1 1.8 1.7 3.5 1.7s2.8-.6 3.5-1.7" stroke="#B91C1C" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </span>
                    <span className="sign-in__wordmark"><span>Blood</span><span>Bridge</span></span>
                    <span className="sign-in__secured">SECURED</span>
                </div>

                <h1 className="sign-in__title">Sign In</h1>

                {authError && (
                    <div className="sign-in__auth-error" role="alert">
                        <AlertCircle aria-hidden="true" />
                        <span>Incorrect email or password. Please try again.</span>
                    </div>
                )}

                <form className="sign-in__form" noValidate onSubmit={handleSubmit}>
                    <div className="sign-in__fields">
                        <Field id="sign-in-email" label="Email Address" error={errors.email}>
                            <input
                                ref={(element) => { fieldRefs.current.email = element }}
                                id="sign-in-email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                inputMode="email"
                                placeholder="john.doe@example.com"
                                value={formData.email}
                                onChange={(event) => updateField('email', event.target.value)}
                                aria-invalid={Boolean(errors.email)}
                                aria-describedby={errors.email ? 'sign-in-email-error' : undefined}
                            />
                        </Field>

                        <Field id="sign-in-password" label="Password" error={errors.password}>
                            <input
                                ref={(element) => { fieldRefs.current.password = element }}
                                id="sign-in-password"
                                name="password"
                                type={passwordVisible ? 'text' : 'password'}
                                autoComplete="current-password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(event) => updateField('password', event.target.value)}
                                aria-invalid={Boolean(errors.password)}
                                aria-describedby={errors.password ? 'sign-in-password-error' : undefined}
                            />
                            <button
                                className="sign-in__password-toggle"
                                type="button"
                                aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                                onClick={() => setPasswordVisible((visible) => !visible)}
                            >
                                {passwordVisible ? <Eye aria-hidden="true" /> : <EyeOff aria-hidden="true" />}
                            </button>
                        </Field>
                    </div>

                    <div className="sign-in__options-row">
                        <label className="sign-in__remember-label" htmlFor="sign-in-remember">
                            <input
                                id="sign-in-remember"
                                type="checkbox"
                                checked={formData.rememberMe}
                                onChange={(event) => updateField('rememberMe', event.target.checked)}
                            />
                            <span>Remember Me</span>
                        </label>
                        <button
                            className="sign-in__forgot-link"
                            type="button"
                            onClick={() => {
                                onForgotPassword()
                                navigate('/ResetPassword')
                            }}
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <button className="sign-in__submit" type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="sign-in__loader" aria-hidden="true" />}
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="sign-in__create-account">
                    Don't have an account? <button type="button" onClick={() => {
                        onCreateAccount()
                        navigate('/OnboardingScreen')
                    }}>Create Account</button>
                </p>
            </section>
        </main>
    )
}

const SignInRoute = () => {
    const navigate = useNavigate()

    const handleSignIn = async (credentials) => {
        const result = await signIn(credentials)
        const role = result?.role || result?.accountType || result?.user?.role

        if (role === 'hospital') {
            navigate('/HospitalDashboard')
        } else {
            navigate('/DonorDashboard')
        }

        return result
    }

    return (
        <SignIn
            onSubmit={handleSignIn}
            onForgotPassword={() => navigate('/ResetPassword')}
            onCreateAccount={() => navigate('/OnboardingScreen')}
        />
    )
}

export { SignIn, SignInRoute }
