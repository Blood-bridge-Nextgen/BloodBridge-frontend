import { useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Droplet,
  Heart,
  MapPin,
  RefreshCw,
  Search,
  ShieldCheck,
} from 'lucide-react'
import DonorNavbar from './DonorNavbar'
import './Dashboard.css'

const requests = [
  {
    id: 'lagos-university',
    priority: 'Critical',
    priorityClass: 'critical',
    hospital: 'Lagos University Teaching Hospital',
    bloodType: 'O+',
    units: 2,
    distance: '5km',
    hours: 3,
  },
  {
    id: 'lagos-island',
    priority: 'High Priority',
    priorityClass: 'high',
    hospital: 'Lagos Island General Hospital',
    bloodType: 'O+',
    units: 3,
    distance: '8km',
    hours: 6,
  },
  {
    id: 'reddington',
    priority: 'Normal',
    priorityClass: 'normal',
    hospital: 'Reddington Hospital',
    bloodType: 'O+',
    units: 1,
    distance: '12km',
    hours: 24,
  },
]

const donationRecords = [
  { date: '15 Aug 2026', hospital: 'Lagos University Teaching Hospital', bloodType: 'O+' },
  { date: '20 May 2026', hospital: 'Lagos Island General Hospital', bloodType: 'O+' },
  { date: '12 Feb 2026', hospital: 'Reddington Hospital', bloodType: 'O+' },
  { date: '10 Nov 2025', hospital: 'Lagos University Teaching Hospital', bloodType: 'O+' },
]

const alerts = [
  {
    icon: AlertTriangle,
    tone: 'critical',
    title: 'Critical O+ shortage',
    description: 'Lagos University Teaching Hospital needs donors nearby',
    time: '1 hr ago',
  },
  {
    icon: CheckCircle2,
    tone: 'success',
    title: 'Hospital accepted your response',
    description: 'Reddington Hospital confirmed your donation slot',
    time: 'Yesterday',
  },
  {
    icon: Clock,
    tone: 'warning',
    title: 'Keep your availability current',
    description: 'Update your status so hospitals can reach you',
    time: '2 days ago',
  },
]

const badges = [
  { label: 'First Donation', earned: true },
  { label: 'Lifesaver', earned: true },
  { label: 'Community Hero', earned: false },
  { label: '10 Donations Club', earned: false },
]

const impactItems = [
  { value: '8', label: 'Donations', icon: Droplet, tone: 'red' },
  { value: '24', label: 'Lives Potentially Saved', icon: Heart, tone: 'red' },
  { value: '12', label: 'Requests Responded To', icon: CheckCircle2, tone: 'green' },
  { value: 'O+', label: 'Blood Group', icon: Droplet, tone: 'red' },
]

const RequestCard = ({ request, accepted, onAccept, onViewDetails }) => {
  const urgencyText = request.hours === 1 ? '1 hour' : `${request.hours} hours`

  return (
    <article className={`donor-dashboard__request-card donor-dashboard__request-card--${request.priorityClass}`}>
      <div className="donor-dashboard__request-topline">
        <span className={`donor-dashboard__priority donor-dashboard__priority--${request.priorityClass}`}>
          {request.priority}
        </span>
        <span className="donor-dashboard__verified"><ShieldCheck aria-hidden="true" /> Verified Request</span>
      </div>
      <div className="donor-dashboard__request-summary">
        <span className="donor-dashboard__blood-type">{request.bloodType}</span>
        <div className="donor-dashboard__request-copy">
          <h3>{request.hospital}</h3>
          <div className="donor-dashboard__request-meta">
            <span><Droplet aria-hidden="true" /> {request.units} units</span>
            <span><MapPin aria-hidden="true" /> {request.distance} away</span>
          </div>
        </div>
      </div>
      <div className="donor-dashboard__request-bottomline">
        <span className={`donor-dashboard__urgency donor-dashboard__urgency--${request.priorityClass}`}>
          <Clock aria-hidden="true" /> Needed within {urgencyText}
        </span>
        <div className="donor-dashboard__request-actions">
          <button
            className={`donor-dashboard__button donor-dashboard__button--accept${accepted ? ' donor-dashboard__button--accepted' : ''}`}
            type="button"
            disabled={accepted}
            onClick={onAccept}
          >
            {accepted ? 'Accepted' : 'Accept Request'}
          </button>
          <button className="donor-dashboard__button donor-dashboard__button--details" type="button" onClick={onViewDetails}>
            View Details
          </button>
        </div>
      </div>
    </article>
  )
}

const RequestsCard = ({ acceptedRequests, onAcceptRequest, onViewDetails }) => (
  <section className="donor-dashboard__card donor-dashboard__requests-card" id="requests" aria-labelledby="nearby-requests-title">
    <div className="donor-dashboard__card-heading donor-dashboard__requests-heading">
      <div>
        <h2 id="nearby-requests-title">Nearby Blood Requests</h2>
        <p>Matched to your blood type, within 10km</p>
      </div>
      <span className="donor-dashboard__active-count">3 active</span>
    </div>
    <div className="donor-dashboard__request-list">
      {requests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          accepted={acceptedRequests.includes(request.id)}
          onAccept={() => onAcceptRequest(request)}
          onViewDetails={() => onViewDetails(request)}
        />
      ))}
    </div>
    <a className="donor-dashboard__view-all-requests" href="#all-requests">
      View all emergency requests <ArrowRight aria-hidden="true" />
    </a>
  </section>
)

const DonationHistory = () => (
  <section className="donor-dashboard__card donor-dashboard__history-card" id="donations" aria-labelledby="donation-history-title">
    <div className="donor-dashboard__card-heading">
      <h2 id="donation-history-title">Donation History</h2>
      <a className="donor-dashboard__text-link" href="#all-donations">See all</a>
    </div>
    <div className="donor-dashboard__table-scroll">
      <table className="donor-dashboard__history-table">
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Hospital</th>
            <th scope="col">Blood Type</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {donationRecords.map((record) => (
            <tr key={`${record.date}-${record.hospital}`}>
              <td>{record.date}</td>
              <td>{record.hospital}</td>
              <td>{record.bloodType}</td>
              <td><span className="donor-dashboard__completed">Completed</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className="donor-dashboard__history-footnote">Every donation counts. A record of the difference you've made.</p>
  </section>
)

const EligibilityCard = ({ eligible = true, daysRemaining = 45 }) => (
  <section className="donor-dashboard__card" aria-labelledby="eligibility-title">
    <div className="donor-dashboard__card-heading">
      <h2 id="eligibility-title">Donation Eligibility</h2>
      <ShieldCheck className="donor-dashboard__heading-icon donor-dashboard__heading-icon--green" aria-hidden="true" />
    </div>
    {eligible ? (
      <div className="donor-dashboard__eligibility-status donor-dashboard__eligibility-status--eligible">
        <CheckCircle2 aria-hidden="true" /> <span>Eligible to Donate</span>
      </div>
    ) : (
      <div className="donor-dashboard__eligibility-status donor-dashboard__eligibility-status--waiting">
        <Clock aria-hidden="true" /> <span>Not Yet Eligible</span>
      </div>
    )}
    {!eligible && (
      <>
        <p className="donor-dashboard__days-remaining">{daysRemaining} days remaining</p>
        <progress
          className="donor-dashboard__eligibility-progress"
          aria-label="Time until eligible"
          max="56"
          value={56 - Math.min(daysRemaining, 56)}
        />
      </>
    )}
    <dl className="donor-dashboard__eligibility-dates">
      <div><dt>Last donation</dt><dd>15 Aug 2026</dd></div>
      <div><dt>Next eligible</dt><dd>{eligible ? '15 Nov 2026' : `In ${daysRemaining} days`}</dd></div>
    </dl>
    <p className="donor-dashboard__eligibility-note">Your eligibility is confirmed at the donation center.</p>
  </section>
)

const ImpactCard = () => (
  <section className="donor-dashboard__card" aria-labelledby="impact-title">
    <div className="donor-dashboard__card-heading">
      <h2 id="impact-title">Your Impact</h2>
    </div>
    <div className="donor-dashboard__impact-grid">
      {impactItems.map(({ value, label, icon: Icon, tone }) => (
        <div className="donor-dashboard__impact-tile" key={label}>
          <Icon className={`donor-dashboard__impact-icon donor-dashboard__impact-icon--${tone}`} aria-hidden="true" />
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  </section>
)

const AlertsCard = () => (
  <section className="donor-dashboard__card" aria-labelledby="alerts-title">
    <div className="donor-dashboard__card-heading">
      <h2 id="alerts-title">Emergency Alerts</h2>
      <a className="donor-dashboard__text-link" href="#all-alerts">View all</a>
    </div>
    <ul className="donor-dashboard__alert-list">
      {alerts.map(({ icon: Icon, tone, title, description, time }) => (
        <li className="donor-dashboard__alert" key={title}>
          <span className={`donor-dashboard__alert-icon donor-dashboard__alert-icon--${tone}`}><Icon aria-hidden="true" /></span>
          <span className="donor-dashboard__alert-copy">
            <strong>{title}</strong>
            <span>{description}</span>
            <time>{time}</time>
          </span>
        </li>
      ))}
    </ul>
  </section>
)

const BadgesCard = () => (
  <section className="donor-dashboard__card" aria-labelledby="badges-title">
    <div className="donor-dashboard__card-heading">
      <h2 id="badges-title">Badges</h2>
      <span className="donor-dashboard__active-count">2 earned</span>
    </div>
    <div className="donor-dashboard__badges-grid">
      {badges.map(({ label, earned }) => (
        <div className={`donor-dashboard__badge-item${earned ? '' : ' donor-dashboard__badge-item--locked'}`} key={label}>
          <span className="donor-dashboard__badge-icon"><Award aria-hidden="true" /></span>
          <span>{label}</span>
        </div>
      ))}
    </div>
    <p className="donor-dashboard__badge-caption">2 more donations to unlock your next badge.</p>
  </section>
)

const WelcomeStrip = ({ donorName, available, onUpdateAvailability, onFindRequests, onScheduleDonation }) => {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Morning' : hour < 16 ? 'Afternoon' : 'Evening'

  return (
    <section className="donor-dashboard__welcome" aria-labelledby="welcome-title">
      <div className="donor-dashboard__welcome-copy">
        <h1 id="welcome-title">Good {greeting}, {donorName}</h1>
        <p>Someone nearby needs your help. Make your next response count.</p>
        <div className="donor-dashboard__welcome-actions">
          <button className="donor-dashboard__welcome-button" type="button" onClick={onUpdateAvailability}><RefreshCw aria-hidden="true" /> Update Availability</button>
          <button className="donor-dashboard__welcome-button donor-dashboard__welcome-button--primary" type="button" onClick={onFindRequests}><Search aria-hidden="true" /> Find Requests</button>
          <button className="donor-dashboard__welcome-button" type="button" onClick={onScheduleDonation}><Calendar aria-hidden="true" /> Schedule Donation</button>
        </div>
      </div>
      <div className="donor-dashboard__welcome-status">
        <div className="donor-dashboard__status-chips">
          <span className="donor-dashboard__status-chip"><Droplet aria-hidden="true" /> Blood Group O+</span>
          <span className="donor-dashboard__status-chip"><MapPin aria-hidden="true" /> Lagos, Nigeria</span>
          <span
            className={`donor-dashboard__status-chip donor-dashboard__status-chip--${available ? 'available' : 'unavailable'}`}
            aria-label={`Availability: ${available ? 'available' : 'unavailable'}`}
          >
            <i aria-hidden="true" /> {available ? 'Available' : 'Unavailable'}
          </span>
        </div>
        <p className="donor-dashboard__live-status"><span className="donor-dashboard__live-dot" /> <strong>Live</strong> Requests updated just now</p>
      </div>
    </section>
  )
}

const DonorDashboard = ({
  donorName = 'Alex',
  eligible = true,
  daysRemaining = 45,
  onAcceptRequest = () => {},
  onViewDetails = () => {},
  onUpdateAvailability = () => {},
  onFindRequests = () => {},
  onScheduleDonation = () => {},
  onLogout = () => {},
  onNotifications = () => {},
}) => {
  const [acceptedRequests, setAcceptedRequests] = useState([])
  const [available, setAvailable] = useState(true)

  const handleAcceptRequest = (request) => {
    setAcceptedRequests((current) => current.includes(request.id) ? current : [...current, request.id])
    onAcceptRequest(request)
  }

  const handleUpdateAvailability = () => {
    setAvailable((current) => !current)
    onUpdateAvailability()
  }

  return (
    <div className="donor-dashboard">
      <DonorNavbar activeLink="requests" onLogout={onLogout} onNotifications={onNotifications} />
      <main className="donor-dashboard__main">
        <div className="alignment-container">
          <div className="donor-dashboard__grid">
            <div className="donor-dashboard__primary-column">
              <RequestsCard
                acceptedRequests={acceptedRequests}
                onAcceptRequest={handleAcceptRequest}
                onViewDetails={onViewDetails}
              />
              <DonationHistory />
            </div>
            <aside className="donor-dashboard__sidebar" aria-label="Donor summary">
              <EligibilityCard eligible={eligible} daysRemaining={daysRemaining} />
              <ImpactCard />
              <AlertsCard />
              <BadgesCard />
            </aside>
          </div>
          <WelcomeStrip
            donorName={donorName}
            available={available}
            onUpdateAvailability={handleUpdateAvailability}
            onFindRequests={onFindRequests}
            onScheduleDonation={onScheduleDonation}
          />
        </div>
      </main>
    </div>
  )
}

export default DonorDashboard
