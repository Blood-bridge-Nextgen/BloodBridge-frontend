import { X } from 'lucide-react'

const Modal = ({ open, donor, onClose }) => {
  if (!open || !donor) return null

  return (
    <div className="hospital-dashboard__modal-backdrop" role="presentation" onClick={onClose}>
      <div className="hospital-dashboard__modal" role="dialog" aria-modal="true" aria-labelledby="donor-modal-title" onClick={(event) => event.stopPropagation()}>
        <button className="hospital-dashboard__modal-close" type="button" aria-label="Close donor details" onClick={onClose}>
          <X aria-hidden="true" />
        </button>
        <span className="hospital-dashboard__modal-badge">Donor Profile</span>
        <h3 id="donor-modal-title">{donor.name}</h3>
        <dl>
          <div>
            <dt>Blood group</dt>
            <dd>{donor.bloodGroup}</dd>
          </div>
          <div>
            <dt>Distance</dt>
            <dd>{donor.distance}km from the hospital</dd>
          </div>
          <div>
            <dt>Availability</dt>
            <dd>{donor.availability}</dd>
          </div>
          <div>
            <dt>Last donation</dt>
            <dd>{donor.lastDonation}</dd>
          </div>
        </dl>
        <button className="hospital-dashboard__modal-button" type="button" onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

export default Modal
