import { CheckCircle2, Clock3, Phone, Trash2 } from 'lucide-react'

const statusClass = {
  Pending: 'pending',
  Fulfilled: 'fulfilled',
}

const urgencyClass = {
  Critical: 'critical',
  High: 'high',
  Medium: 'medium',
  Low: 'low',
}

const RequestCard = ({ request, onFulfill, onDelete, onContact }) => (
  <article className={`hospital-dashboard__request-card hospital-dashboard__request-card--${statusClass[request.status]}`}>
    <div className="hospital-dashboard__request-header">
      <div>
        <span className="hospital-dashboard__request-blood">{request.bloodGroup}</span>
        <h3>{request.patient}</h3>
      </div>
      <span className={`hospital-dashboard__urgency hospital-dashboard__urgency--${urgencyClass[request.urgency]}`}>
        {request.urgency}
      </span>
    </div>

    <div className="hospital-dashboard__request-meta">
      <span><Clock3 aria-hidden="true" /> {request.responses} responses</span>
      <span className={`hospital-dashboard__status hospital-dashboard__status--${statusClass[request.status]}`}>
        {request.status}
      </span>
    </div>

    <div className="hospital-dashboard__request-actions">
      <button className="hospital-dashboard__button hospital-dashboard__button--secondary" type="button" onClick={() => onContact(request)}>
        <Phone aria-hidden="true" /> Contact Donor
      </button>
      <button className="hospital-dashboard__button hospital-dashboard__button--secondary" type="button" onClick={() => onFulfill(request.id)}>
        <CheckCircle2 aria-hidden="true" /> Mark Fulfilled
      </button>
      <button className="hospital-dashboard__button hospital-dashboard__button--danger" type="button" onClick={() => onDelete(request.id)}>
        <Trash2 aria-hidden="true" /> Cancel
      </button>
    </div>

    <button className="hospital-dashboard__text-button" type="button">View Request</button>
  </article>
)

export default RequestCard
