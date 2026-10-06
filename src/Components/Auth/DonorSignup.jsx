import { useRef, useState } from 'react'
import { ArrowLeft, ChevronDown, Eye, EyeOff } from 'lucide-react'
import './AuthStyle.css'

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', "I don't know yet"]
const noop = () => {}

const Field = ({
	id,
	label,
	name,
	type = 'text',
	placeholder,
	value,
	error,
	onChange,
	inputRef,
	autoComplete,
	inputMode,
	options,
}) => {
	const [passwordVisible, setPasswordVisible] = useState(false)
	const isPassword = type === 'password'
	const errorId = `${id}-error`

	return (
		<div className="donor-signup__field">
			<label className="donor-signup__label" htmlFor={id}>{label}</label>
			<div className={`donor-signup__control${error ? ' donor-signup__control--error' : ''}`}>
				{options ? (
					<>
						<select
							ref={inputRef}
							id={id}
							name={name}
							value={value}
							onChange={onChange}
							aria-invalid={Boolean(error)}
							aria-describedby={error ? errorId : undefined}
						>
							<option value="" disabled>{placeholder}</option>
							{options.map((option) => <option key={option} value={option}>{option}</option>)}
						</select>
						<ChevronDown className="donor-signup__select-icon" aria-hidden="true" />
					</>
				) : (
					<>
						<input
							ref={inputRef}
							id={id}
							name={name}
							type={isPassword && passwordVisible ? 'text' : type}
							value={value}
							onChange={onChange}
							placeholder={placeholder}
							autoComplete={autoComplete}
							inputMode={inputMode}
							aria-invalid={Boolean(error)}
							aria-describedby={error ? errorId : undefined}
						/>
						{isPassword && (
							<button
								className="donor-signup__visibility-toggle"
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
			{error && <p className="donor-signup__error" id={errorId} role="alert">{error}</p>}
		</div>
	)
}

const DonorSignup = ({ onBack = () => window.history.back(), onSignIn = noop, onCreateAccount = noop }) => {
	const [formData, setFormData] = useState({
		fullName: '',
		email: '',
		phone: '',
		password: '',
		confirmPassword: '',
		bloodGroup: '',
		location: '',
		available: true,
		termsAccepted: false,
	})
	const [errors, setErrors] = useState({})
	const [isSubmitting, setIsSubmitting] = useState(false)
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

	const renderField = (name, label, props = {}) => (
		<Field
			key={name}
			id={`donor-signup-${name}`}
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
		if (formData.fullName.trim().length < 2) nextErrors.fullName = 'Enter your full name.'
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) nextErrors.email = 'Enter a valid email address.'
		if (formData.phone.replace(/\D/g, '').length < 10) nextErrors.phone = 'Enter a phone number with at least 10 digits.'
		if (formData.password.length < 8) nextErrors.password = 'Password must be at least 8 characters.'
		if (!formData.confirmPassword || formData.confirmPassword !== formData.password) {
			nextErrors.confirmPassword = 'Passwords must match.'
		}
		if (!formData.bloodGroup) nextErrors.bloodGroup = 'Select a blood group.'
		if (formData.location.trim().length < 2) nextErrors.location = 'Enter your city and state.'
		if (!formData.termsAccepted) nextErrors.termsAccepted = 'Accept the terms to create your account.'

		setErrors(nextErrors)
		const firstInvalidField = Object.keys(nextErrors)[0]
		if (firstInvalidField) {
			fieldRefs.current[firstInvalidField]?.focus()
			return
		}

		setIsSubmitting(true)
		try {
			await onCreateAccount({ ...formData })
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<main className="donor-signup">
			<div className="donor-signup__card">
				<header className="donor-signup__header">
					<button className="donor-signup__back-button" type="button" aria-label="Go back" onClick={onBack}>
						<ArrowLeft aria-hidden="true" />
					</button>
					<h1>Create Donor Account</h1>
				</header>

				<form className="donor-signup__form" noValidate onSubmit={handleSubmit}>
					{renderField('fullName', 'Full Name', { placeholder: 'John Doe', autoComplete: 'name' })}
					{renderField('email', 'Email Address', { type: 'email', placeholder: 'john@example.com', autoComplete: 'email' })}
					{renderField('phone', 'Phone Number', { type: 'tel', placeholder: '+1 (555) 019-9234', autoComplete: 'tel', inputMode: 'tel' })}
					{renderField('password', 'Password', { type: 'password', placeholder: '••••••••', autoComplete: 'new-password' })}
					{renderField('confirmPassword', 'Confirm Password', { type: 'password', placeholder: '••••••••', autoComplete: 'new-password' })}

					<div className="donor-signup__field-row">
						{renderField('bloodGroup', 'Blood Group', { placeholder: 'Select blood group', options: bloodGroups })}
						{renderField('location', 'Location', { placeholder: 'City, State', autoComplete: 'address-level2' })}
					</div>

					<div className="donor-signup__availability-row">
						<span>Availability Status ({formData.available ? 'Available to Donate' : 'Not Available'})</span>
						<button
							className={`donor-signup__switch${formData.available ? ' donor-signup__switch--on' : ''}`}
							type="button"
							role="switch"
							aria-checked={formData.available}
							aria-label="Availability status"
							onClick={() => updateField('available', !formData.available)}
						>
							<span />
						</button>
					</div>

					<div className="donor-signup__terms-field">
						<label className="donor-signup__terms-row" htmlFor="donor-signup-termsAccepted">
							<input
								ref={(element) => { fieldRefs.current.termsAccepted = element }}
								id="donor-signup-termsAccepted"
								type="checkbox"
								checked={formData.termsAccepted}
								onChange={(event) => updateField('termsAccepted', event.target.checked)}
								aria-invalid={Boolean(errors.termsAccepted)}
								aria-describedby={errors.termsAccepted ? 'donor-signup-termsAccepted-error' : undefined}
							/>
							<span>
								I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
							</span>
						</label>
						{errors.termsAccepted && <p className="donor-signup__error" id="donor-signup-termsAccepted-error" role="alert">{errors.termsAccepted}</p>}
					</div>

					<button className="donor-signup__submit" type="submit" disabled={isSubmitting}>
						{isSubmitting && <span className="donor-signup__spinner" aria-hidden="true" />}
						{isSubmitting ? 'Creating account...' : 'Create Donor Account'}
					</button>
				</form>

				<p className="donor-signup__signin">
					Already have an account? <button type="button" onClick={onSignIn}>Sign in</button>
				</p>
			</div>
		</main>
	)
}

export default DonorSignup
