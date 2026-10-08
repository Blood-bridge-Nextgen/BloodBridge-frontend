import { Check, Clock3, MapPin, Send, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import '../styles/request-blood-modal.css'

const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']
const departments = ['Emergency', 'Surgery', 'Maternity', 'ICU', 'Pediatrics', 'General Ward', 'Outpatient']
const urgencyOptions = [
  { value: 'Normal', label: 'Normal', tone: 'normal' },
  { value: 'High Priority', label: 'High Priority', tone: 'high' },
  { value: 'Critical', label: 'Critical', tone: 'critical' },
]

const getTodayValue = () => new Date().toISOString().split('T')[0]

const createInitialForm = () => ({
  bloodGroup: 'O+',
  units: 3,
  urgency: 'Critical',
  requiredDate: getTodayValue(),
  department: 'Emergency',
  patientCondition: 'Emergency surgery - acute blood loss',
  notes: 'Please coordinate with the Emergency department on arrival. Confirm the duty nurse for donation scheduling.',
})

const validateForm = (formData) => {
  const errors = {}
  const units = Number(formData.units)
  const requiredDate = formData.requiredDate
  const today = getTodayValue()

  if (!formData.bloodGroup) errors.bloodGroup = 'Select a blood group.'
  if (!Number.isInteger(units) || units < 1) errors.units = 'Units must be at least 1.'
  if (!formData.urgency) errors.urgency = 'Select an urgency level.'
  if (!requiredDate) errors.requiredDate = 'Select a required date.'
  else if (requiredDate < today) errors.requiredDate = 'Required date cannot be before today.'
  if (!formData.department) errors.department = 'Select a department.'
  if (!formData.patientCondition.trim()) errors.patientCondition = 'Enter the patient condition.'
  if (!formData.location) errors.location = 'Allow location access to submit the request.'

  return errors
}

const RequestBloodModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(createInitialForm)
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [locationStatus, setLocationStatus] = useState('not-available')
  const dialogRef = useRef(null)
  const firstFieldRef = useRef(null)

  const initialData = useMemo(() => createInitialForm(), [])
  const hasUnsavedChanges = JSON.stringify(formData) !== JSON.stringify(initialData)

  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    firstFieldRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const resetForm = () => {
    setFormData(createInitialForm())
    setFormErrors({})
    setLocationStatus('not-available')
  }

  const requestCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('unsupported')
      setFormErrors((current) => ({ ...current, location: 'Location access is not supported by this browser.' }))
      return
    }

    setLocationStatus('loading')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nextLocation = {
          latitude: Number(coords.latitude.toFixed(6)),
          longitude: Number(coords.longitude.toFixed(6)),
        }
        setFormData((current) => ({ ...current, location: nextLocation }))
        setFormErrors((current) => {
          const nextErrors = { ...current }
          delete nextErrors.location
          return nextErrors
        })
        setLocationStatus('available')
      },
      () => {
        setLocationStatus('denied')
        setFormErrors((current) => ({ ...current, location: 'Allow location access so the request can be matched to nearby donors.' }))
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const closeModal = () => {
    if (isSubmitting) return
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('Discard unsaved changes?')
      if (!confirmed) return
    }
    resetForm()
    onClose()
  }

  const handleFieldChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }))
    setFormErrors((current) => {
      if (!current[field]) return current
      const nextErrors = { ...current }
      delete nextErrors[field]
      return nextErrors
    })
  }

  const handleUnitsChange = (value) => {
    const nextValue = Number(value)
    if (Number.isNaN(nextValue)) {
      setFormData((current) => ({ ...current, units: '' }))
      return
    }
    handleFieldChange('units', Math.max(1, nextValue))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const errors = validateForm(formData)

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsSubmitting(true)
    setFormErrors({})

    try {
      await onSubmit({
        ...formData,
        units: Number(formData.units),
      })
      resetForm()
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="request-blood-modal__backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget && !hasUnsavedChanges) onClose()
      }}
    >
      <div
        ref={dialogRef}
        className="request-blood-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-blood-title"
      >
        <header className="request-blood-modal__header">
          <div>
            <h2 id="request-blood-title">Request Blood</h2>
            <p>Share the requirements. We&apos;ll find compatible donors.</p>
          </div>

          <button
            type="button"
            className="request-blood-modal__close"
            aria-label="Close request blood form"
            onClick={closeModal}
            disabled={isSubmitting}
          >
            <X aria-hidden="true" />
          </button>
        </header>

        <div className="request-blood-modal__hospital-strip">
          <span>Logos University Teaching Hospital</span>
          <span className="request-blood-modal__verified">
            <Check aria-hidden="true" /> Verified
          </span>
        </div>

        <form className="request-blood-modal__form" onSubmit={handleSubmit} noValidate>
          <div className="request-blood-modal__field request-blood-modal__field--half">
            <label htmlFor="blood-group">Blood group *</label>
            <select
              id="blood-group"
              ref={firstFieldRef}
              value={formData.bloodGroup}
              onChange={(event) => handleFieldChange('bloodGroup', event.target.value)}
              aria-invalid={Boolean(formErrors.bloodGroup)}
            >
              {bloodGroups.map((group) => <option key={group} value={group}>{group}</option>)}
            </select>
            {formErrors.bloodGroup && <span className="request-blood-modal__error">{formErrors.bloodGroup}</span>}
          </div>

          <div className="request-blood-modal__field request-blood-modal__field--half">
            <label htmlFor="units">Units *</label>
            <input
              id="units"
              type="number"
              min="1"
              step="1"
              value={formData.units}
              onChange={(event) => handleUnitsChange(event.target.value)}
              aria-invalid={Boolean(formErrors.units)}
            />
            {formErrors.units && <span className="request-blood-modal__error">{formErrors.units}</span>}
          </div>

          <div className="request-blood-modal__field request-blood-modal__field--full">
            <span className="request-blood-modal__label">Urgency *</span>
            <div className="request-blood-modal__urgency-options" role="radiogroup" aria-label="Urgency">
              {urgencyOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`request-blood-modal__urgency-option request-blood-modal__urgency-option--${option.tone}${formData.urgency === option.value ? ' request-blood-modal__urgency-option--selected' : ''}`}
                  onClick={() => handleFieldChange('urgency', option.value)}
                  aria-pressed={formData.urgency === option.value}
                >
                  <span className="request-blood-modal__radio" aria-hidden="true" />
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
            {formErrors.urgency && <span className="request-blood-modal__error">{formErrors.urgency}</span>}
            {formData.urgency === 'Critical' && (
              <p className="request-blood-modal__warning">
                <Clock3 aria-hidden="true" /> Critical requests are immediately visible to available donors nearby.
              </p>
            )}
          </div>

          <div className="request-blood-modal__field request-blood-modal__field--half">
            <label htmlFor="required-date">Required date *</label>
            <input
              id="required-date"
              type="date"
              min={getTodayValue()}
              value={formData.requiredDate}
              onChange={(event) => handleFieldChange('requiredDate', event.target.value)}
              aria-invalid={Boolean(formErrors.requiredDate)}
            />
            {formErrors.requiredDate && <span className="request-blood-modal__error">{formErrors.requiredDate}</span>}
          </div>

          <div className="request-blood-modal__field request-blood-modal__field--half">
            <label htmlFor="department">Department *</label>
            <select
              id="department"
              value={formData.department}
              onChange={(event) => handleFieldChange('department', event.target.value)}
              aria-invalid={Boolean(formErrors.department)}
            >
              {departments.map((department) => <option key={department} value={department}>{department}</option>)}
            </select>
            {formErrors.department && <span className="request-blood-modal__error">{formErrors.department}</span>}
          </div>

          <div className="request-blood-modal__field request-blood-modal__field--full">
            <label htmlFor="patient-condition">Patient condition *</label>
            <input
              id="patient-condition"
              type="text"
              value={formData.patientCondition}
              placeholder="Emergency surgery - acute blood loss"
              onChange={(event) => handleFieldChange('patientCondition', event.target.value)}
              aria-invalid={Boolean(formErrors.patientCondition)}
            />
            {formErrors.patientCondition && <span className="request-blood-modal__error">{formErrors.patientCondition}</span>}
          </div>

          <div className="request-blood-modal__field request-blood-modal__field--full">
            <div className="request-blood-modal__location-header">
              <label>Hospital location *</label>
              <button type="button" className="request-blood-modal__location-button" onClick={requestCurrentLocation} disabled={isSubmitting}>
                <MapPin aria-hidden="true" />
                {locationStatus === 'loading' ? 'Getting location...' : 'Use my current location'}
              </button>
            </div>

            {formData.location ? (
              <p className="request-blood-modal__location-value">
                {formData.location.latitude.toFixed(6)}, {formData.location.longitude.toFixed(6)}
              </p>
            ) : (
              <p className="request-blood-modal__location-hint">Allow location access to match this request with nearby donors.</p>
            )}
            {formErrors.location && <span className="request-blood-modal__error">{formErrors.location}</span>}
          </div>

          <div className="request-blood-modal__field request-blood-modal__field--full">
            <label htmlFor="notes">Notes (optional)</label>
            <textarea
              id="notes"
              value={formData.notes}
              placeholder="Please coordinate with the Emergency department on arrival. Confirm the duty nurse for donation scheduling."
              rows="3"
              onChange={(event) => handleFieldChange('notes', event.target.value)}
            />
            <small>Do not include patient names or identifying details. Only request requirements are shared with donors.</small>
          </div>

          <footer className="request-blood-modal__footer">
            <p>Your hospital information is verified. Requests are reviewed before matching.</p>
            <div className="request-blood-modal__actions">
              <button type="button" className="request-blood-modal__cancel" onClick={closeModal} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" className="request-blood-modal__submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : <><Send aria-hidden="true" /> Submit Request</>}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  )
}

export default RequestBloodModal
