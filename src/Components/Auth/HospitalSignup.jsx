import { useRef, useState } from 'react'
import { ArrowLeft, ChevronDown, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import './AuthStyle.css'

const facilityTypes = ['Hospital', 'Blood Bank', 'Clinic', 'Diagnostic Center', 'Other']
const noop = () => {}
const facilitySignupUrl = import.meta.env.VITE_HOSPITAL_SIGNUP_API

const registerFacility = async (payload) => {
	if (!facilitySignupUrl) throw new Error('Facility signup endpoint is not configured.')

	const response = await fetch(facilitySignupUrl, {
		method: 'POST',
		headers: {
			accept: '*/*',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload),
	})

	const responseData = await response.json().catch(() => ({}))
	if (!response.ok) {
		const message = responseData.message || responseData.error || 'Unable to register your organization. Please try again.'
		throw new Error(Array.isArray(message) ? message.join(' ') : message)
	}

	return responseData
}

const Field = ({
	id,
	name,
	label,
	value,
	onChange,
	error,
	inputRef,
	placeholder,
	type = 'text',
	autoComplete,
	autoCapitalize,
	inputMode,
	options,
}) => {
	const [passwordVisible, setPasswordVisible] = useState(false)
	const isPassword = type === 'password'
	const errorId = `${id}-error`

	return (
		<div className="hospital-signup__field">
			<label className="hospital-signup__label" htmlFor={id}>{label}</label>
			<div className={`hospital-signup__control${error ? ' hospital-signup__control--error' : ''}`}>
				{options ? (
					<>
						<select
							id={id}
							name={name}
							value={value}
							onChange={onChange}
							ref={inputRef}
							aria-invalid={Boolean(error)}
							aria-describedby={error ? errorId : undefined}
						>
							{options.map((option) => <option key={option} value={option}>{option}</option>)}
						</select>
						<ChevronDown className="hospital-signup__select-icon" aria-hidden="true" />
					</>
				) : (
					<>
						<input
							id={id}
							name={name}
							type={isPassword && passwordVisible ? 'text' : type}
							value={value}
							onChange={onChange}
							onBlur={name === 'licenseNumber' ? (event) => onChange({ target: { value: event.target.value.toUpperCase() } }) : undefined}
							ref={inputRef}
							placeholder={placeholder}
							autoComplete={autoComplete}
							autoCapitalize={autoCapitalize}
							inputMode={inputMode}
							aria-invalid={Boolean(error)}
							aria-describedby={error ? errorId : undefined}
						/>
						{isPassword && (
							<button
								className="hospital-signup__visibility-toggle"
								type="button"
								aria-label={passwordVisible ? 'Hide password' : 'Show password'}
								onClick={() => setPasswordVisible((visible) => !visible)}
							>
								{passwordVisible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
							</button>
						)}
					</>
				)}
			</div>
			{error && <p className="hospital-signup__error" id={errorId} role="alert">{error}</p>}
		</div>
	)
}

const HospitalSignup = ({ onBack = () => window.history.back(), onSignIn = noop, onSubmit = registerFacility }) => {
	const [formData, setFormData] = useState({
		organizationName: '',
		facilityType: 'Hospital',
		email: '',
		phone: '',
		address: '',
		licenseNumber: '',
		password: '',
		confirmPassword: '',
	})
	const [errors, setErrors] = useState({})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [feedback, setFeedback] = useState(null)
	const fieldRefs = useRef({})

	const updateField = (name, value) => {
		setFormData((current) => ({ ...current, [name]: value }))
		setErrors((current) => {
			if (!current[name]) return current
			const nextErrors = { ...current }
			delete nextErrors[name]
			return nextErrors
		})
		setFeedback(null)
	}

	const renderField = (name, label, props = {}) => (
		<Field
			key={name}
			id={`hospital-signup-${name}`}
			name={name}
			label={label}
			value={formData[name]}
			error={errors[name]}
			onChange={(event) => updateField(name, event.target.value)}
			inputRef={(element) => { fieldRefs.current[name] = element }}
			{...props}
		/>
	)

	const handleSubmit = async (event) => {
		event.preventDefault()
		if (isSubmitting) return

		const nextErrors = {}
		if (formData.organizationName.trim().length < 2) nextErrors.organizationName = 'Enter an organization name with at least 2 characters.'
		if (!formData.facilityType) nextErrors.facilityType = 'Select a facility type.'
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) nextErrors.email = 'Enter a valid email address.'
		if (formData.phone.replace(/\D/g, '').length < 10) nextErrors.phone = 'Enter a phone number with at least 10 digits.'
		if (formData.address.trim().length < 5) nextErrors.address = 'Enter an address with at least 5 characters.'
		if (!/^[A-Z0-9-]{6,}$/i.test(formData.licenseNumber.trim())) {
			nextErrors.licenseNumber = 'Use at least 6 letters, numbers, or hyphens.'
		}
		if (formData.password.length < 8 ) {
			nextErrors.password = 'Use at least 8 characters with a letter and a number.'
		}
		if (!formData.confirmPassword || formData.confirmPassword !== formData.password) {
			nextErrors.confirmPassword = 'Passwords must match.'
		}

		setErrors(nextErrors)
		const firstInvalidField = Object.keys(nextErrors)[0]
		if (firstInvalidField) {
			fieldRefs.current[firstInvalidField]?.focus()
			return
		}

		setIsSubmitting(true)
		setFeedback(null)
		try {
			const payload = {
				organizationName: formData.organizationName.trim(),
				registrationNumber: formData.licenseNumber.trim().toUpperCase(),
				email: formData.email.trim(),
				phone: formData.phone.trim(),
				address: formData.address.trim(),
				password: formData.password,
				confirmPassword: formData.confirmPassword,
			}
			const result = await onSubmit(payload)
			setFeedback({ type: 'success', message: result?.message || 'Organization registration submitted successfully.' })
		} catch (error) {
			setFeedback({ type: 'error', message: error.message || 'Unable to register your organization. Please try again.' })
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<main className="hospital-signup">
			<div className="hospital-signup__card">
				<header className="hospital-signup__header">
					<button className="hospital-signup__back-button" type="button" aria-label="Go back" onClick={onBack}>
						<ArrowLeft aria-hidden="true" />
					</button>
					<h1>Register Organization</h1>
				</header>

				<form className="hospital-signup__form" noValidate onSubmit={handleSubmit}>
					{renderField('organizationName', 'Organization Name', { placeholder: 'St. Jude General Hospital', autoComplete: 'organization' })}
					{renderField('facilityType', 'Facility Type', { options: facilityTypes })}
					{renderField('email', 'Email Address', { type: 'email', placeholder: 'cpe@stjude.org', autoComplete: 'email' })}
					{renderField('phone', 'Phone Number', { type: 'tel', placeholder: '+1 (800) 555-0199', autoComplete: 'tel', inputMode: 'tel' })}
					{renderField('address', 'Address', { placeholder: '100 Medical Center Pkwy', autoComplete: 'street-address' })}
					{renderField('licenseNumber', 'License / Registration Number', { placeholder: 'LIC-592384-88', autoCapitalize: 'characters' })}

					<div className="hospital-signup__password-row">
						{renderField('password', 'Password', { type: 'password', placeholder: '••••••••', autoComplete: 'new-password' })}
						{renderField('confirmPassword', 'Confirm', { type: 'password', placeholder: '••••••••', autoComplete: 'new-password' })}
					</div>

					<aside className="hospital-signup__notice">
						<span className="hospital-signup__notice-icon"><ShieldCheck aria-hidden="true" /></span>
						<p>Your organization will be verified before you can create blood requests. Verification typically takes 1-2 business days.</p>
					</aside>

					{feedback && (
						<p className={`hospital-signup__feedback hospital-signup__feedback--${feedback.type}`} role={feedback.type === 'error' ? 'alert' : 'status'}>
							{feedback.message}
						</p>
					)}

					<button className="hospital-signup__submit" type="submit" disabled={isSubmitting}>
						{isSubmitting && <span className="hospital-signup__spinner" aria-hidden="true" />}
						{isSubmitting ? 'Submitting...' : 'Register Organization'}
					</button>
				</form>

				<p className="hospital-signup__signin">
					Already have an account? <button type="button" onClick={onSignIn}>Sign in</button>
				</p>
			</div>
		</main>
	)
}

export default HospitalSignup
