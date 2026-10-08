import { useEffect, useMemo, useState } from 'react'
import { CirclePlus, HeartPulse } from 'lucide-react'
import Header from './components/Header'
import StatCard from './components/StatCard'
import ActiveRequests from './components/ActiveRequests'
import DonorTable from './components/DonorTable'
import BloodInventory from './components/BloodInventory'
import AnalyticsPanel from './components/AnalyticsPanel'
import EmergencyMap from './components/EmergencyMap'
import AuditLog from './components/AuditLog'
import Modal from './components/Modal'
import RequestBloodModal from './components/RequestBloodModal'
import { initialRequests } from './data/requests'
import { initialDonors } from './data/donors'
import { initialInventory } from './data/inventory'
import { createBloodRequest, getBloodRequests } from '../../../api/requestsApi'
import './styles/dashboard.css'
import './styles/header.css'
import './styles/cards.css'
import './styles/tables.css'
import './styles/responsive.css'

const initialAuditLogs = [
  { id: 1, action: 'Request #BB0242 created', timestamp: '08:15 AM', user: 'Emergency Desk' },
  { id: 2, action: 'Donor verified', timestamp: '07:58 AM', user: 'Blood Bank' },
  { id: 3, action: 'Blood request fulfilled', timestamp: '07:21 AM', user: 'Clinical Team' },
  { id: 4, action: 'Inventory updated', timestamp: '06:42 AM', user: 'Laboratory' },
]

const statDefinitions = [
  { label: 'Available Units', value: '320', description: 'Across all blood groups', tone: 'units' },
  { label: 'Active Requests', value: '12', description: 'Emergency + scheduled', tone: 'requests' },
  { label: 'Critical Requests', value: '4', description: 'Immediate attention required', tone: 'critical' },
  { label: 'Matched Donors', value: '56', description: 'Available within 10km', tone: 'donors' },
]

const HospitalDashboard = () => {
  const [requests, setRequests] = useState(initialRequests)
  const [donors] = useState(initialDonors)
  const [inventory] = useState(initialInventory)
  const [selectedDonor, setSelectedDonor] = useState(null)
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs)
  const [requestForm, setRequestForm] = useState({ bloodGroup: 'O+', patient: '', urgency: 'High' })
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [notification, setNotification] = useState(null)

  const analytics = useMemo(() => {
    const totalRequests = requests.length
    const fulfilledRequests = requests.filter((request) => request.status === 'Fulfilled').length
    const activeRequests = requests.filter((request) => request.status === 'Pending').length
    const fulfillmentRate = totalRequests ? Math.round((fulfilledRequests / totalRequests) * 100) : 0

    return {
      totalRequests,
      fulfilledRequests,
      activeRequests,
      fulfillmentRate,
      averageResponseTime: '18 min',
    }
  }, [requests])

  const statCards = useMemo(() => [
    {
      ...statDefinitions[0],
      value: inventory.reduce((total, item) => total + item.units, 0).toString(),
    },
    {
      ...statDefinitions[1],
      value: analytics.activeRequests.toString(),
    },
    {
      ...statDefinitions[2],
      value: requests.filter((request) => request.urgency === 'Critical' && request.status === 'Pending').length.toString(),
    },
    {
      ...statDefinitions[3],
      value: donors.filter((donor) => donor.availability === 'Available' && donor.distance <= 10).length.toString(),
    },
  ], [analytics.activeRequests, donors, inventory, requests])

  const addLog = (action, user = 'Hospital Staff') => {
    setAuditLogs((current) => [{
      id: Date.now(),
      action,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user,
    }, ...current])
  }

  const handleAddRequest = () => {
    const patient = requestForm.patient.trim()
    if (!patient) return

    const nextRequest = {
      id: Date.now(),
      bloodGroup: requestForm.bloodGroup,
      patient,
      urgency: requestForm.urgency,
      responses: 0,
      status: 'Pending',
      requestedAt: new Date().toISOString(),
    }

    setRequests((current) => [nextRequest, ...current])
    setRequestForm({ bloodGroup: 'O+', patient: '', urgency: 'High' })
    addLog(`Request #${nextRequest.id.toString().slice(-4)} created`, 'Emergency Desk')
  }

  const handleRequestSubmit = async ({ bloodGroup, units, urgency, location }) => {
    const token = localStorage.getItem('accessToken')

    if (!token) {
      throw new Error('You must sign in to create a blood request.')
    }

    if (!location || typeof location !== 'object') {
      throw new Error('Allow location access to submit the blood request.')
    }

    const payload = {
      bloodGroup,
      pricePerPint: 1000,
      quantity: units,
      requiredDonors: units,
      type: urgency === 'Critical' ? 'emergency' : 'voluntary',
      status: 'open',
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    }

    const createdRequest = await createBloodRequest(token, payload)

    addLog(`Request #${createdRequest.id?.toString().slice(-4) || 'created'} created`, 'Emergency Desk')
    setNotification('Blood request submitted successfully.')

    const latestRequests = await getBloodRequests({ token, limit: 10, page: 1 })
    setRequests(latestRequests.data || latestRequests.requests || [])
  }

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    getBloodRequests({ token, limit: 10, page: 1 })
      .then((data) => {
        const nextRequests = data.data || data.requests || []
        setRequests(nextRequests)
      })
      .catch(() => {})
  }, [])

  const handleFulfill = (requestId) => {
    setRequests((current) => current.map((request) => request.id === requestId
      ? { ...request, status: 'Fulfilled', responses: request.responses + 1 }
      : request))
    addLog(`Request #${requestId} fulfilled`, 'Clinical Team')
  }

  const handleDelete = (requestId) => {
    setRequests((current) => current.filter((request) => request.id !== requestId))
    addLog(`Request #${requestId} cancelled`, 'Emergency Desk')
  }

  const handleSchedule = (donor) => {
    addLog(`${donor.name} scheduled for donation`, 'Donor Coordinators')
  }

  const handleContact = (donor) => {
    addLog(`Contacted ${donor.name}`, 'Donor Coordinators')
  }

  useEffect(() => {
    if (!notification) return undefined

    const timeoutId = window.setTimeout(() => setNotification(null), 3500)
    return () => window.clearTimeout(timeoutId)
  }, [notification])

  return (
    <main className="hospital-dashboard">
      <Header onRequestBlood={() => setIsRequestModalOpen(true)} />

      <div className="hospital-dashboard__content">
        <section className="hospital-dashboard__stats" aria-label="Hospital statistics">
          {statCards.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        <div className="hospital-dashboard__main-grid">
          <div className="hospital-dashboard__primary-column">
            <section className="hospital-dashboard__panel hospital-dashboard__panel--request-form">
              <div className="hospital-dashboard__panel-heading">
                <div>
                  <p className="hospital-dashboard__eyebrow">Request Center</p>
                  <h2>Add Blood Request</h2>
                </div>
                <span className="hospital-dashboard__panel-icon"><HeartPulse aria-hidden="true" /></span>
              </div>

              <div className="hospital-dashboard__request-form-grid">
                <label>
                  <span>Patient</span>
                  <input
                    type="text"
                    value={requestForm.patient}
                    placeholder="Emergency Case #243"
                    onChange={(event) => setRequestForm((current) => ({ ...current, patient: event.target.value }))}
                  />
                </label>

                <label>
                  <span>Blood Group</span>
                  <select value={requestForm.bloodGroup} onChange={(event) => setRequestForm((current) => ({ ...current, bloodGroup: event.target.value }))}>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </label>

                <label>
                  <span>Urgency</span>
                  <select value={requestForm.urgency} onChange={(event) => setRequestForm((current) => ({ ...current, urgency: event.target.value }))}>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </label>

                <button type="button" className="hospital-dashboard__primary-button" onClick={handleAddRequest}>
                  <CirclePlus aria-hidden="true" /> Add Request
                </button>
              </div>
            </section>

            <ActiveRequests
              requests={requests}
              onFulfill={handleFulfill}
              onDelete={handleDelete}
              onContact={handleContact}
            />

            <DonorTable
              donors={donors}
              onContact={handleContact}
              onSchedule={handleSchedule}
            />

            <EmergencyMap onSelectDonor={setSelectedDonor} />
          </div>

          <aside className="hospital-dashboard__sidebar">
            <BloodInventory inventory={inventory} />
            <AnalyticsPanel analytics={analytics} />
            <AuditLog logs={auditLogs} />
          </aside>
        </div>
      </div>

      <Modal open={Boolean(selectedDonor)} donor={selectedDonor} onClose={() => setSelectedDonor(null)} />
      <RequestBloodModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSubmit={handleRequestSubmit}
      />

      {notification && (
        <div className="hospital-dashboard__notification" role="status" aria-live="polite">
          {notification}
        </div>
      )}
    </main>
  )
}

export default HospitalDashboard
