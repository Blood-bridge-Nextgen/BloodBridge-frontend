import { MapPin, Navigation } from 'lucide-react'
import { useState } from 'react'

const donorLocations = [
  { id: 1, name: 'John Doe', distance: 2, left: '58%', top: '46%' },
  { id: 2, name: 'Mary Okafor', distance: 4, left: '70%', top: '62%' },
  { id: 3, name: 'Ada Bello', distance: 3, left: '36%', top: '38%' },
  { id: 4, name: 'Chinedu Ayo', distance: 8, left: '80%', top: '27%' },
]

const EmergencyMap = ({ onSelectDonor }) => {
  const [activeDonorId, setActiveDonorId] = useState(1)

  const handleDonorClick = (donor) => {
    setActiveDonorId(donor.id)
    onSelectDonor(donor)
  }

  return (
    <section className="hospital-dashboard__panel hospital-dashboard__panel--map">
      <div className="hospital-dashboard__panel-heading hospital-dashboard__panel-heading--tight">
        <div>
          <p className="hospital-dashboard__eyebrow">Response</p>
          <h2>Emergency Map</h2>
        </div>
        <span className="hospital-dashboard__map-status"><Navigation aria-hidden="true" /> Live</span>
      </div>

      <div className="hospital-dashboard__map" aria-label="Simulated emergency map">
        <div className="hospital-dashboard__map-road hospital-dashboard__map-road--one" />
        <div className="hospital-dashboard__map-road hospital-dashboard__map-road--two" />
        <div className="hospital-dashboard__map-road hospital-dashboard__map-road--three" />

        <div className="hospital-dashboard__hospital-marker" aria-label="Hospital location">
          <MapPin aria-hidden="true" />
          <span>Lagos City Hospital</span>
        </div>

        <div className="hospital-dashboard__request-marker" aria-label="Active emergency request">
          <span>O+</span>
        </div>

        {donorLocations.map((donor) => (
          <button
            key={donor.id}
            type="button"
            className={`hospital-dashboard__donor-marker${activeDonorId === donor.id ? ' hospital-dashboard__donor-marker--active' : ''}`}
            style={{ left: donor.left, top: donor.top }}
            aria-label={`View donor ${donor.name}`}
            onClick={() => handleDonorClick(donor)}
          >
            <MapPin aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  )
}

export default EmergencyMap
