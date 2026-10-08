import { CalendarPlus, Phone } from 'lucide-react'
import { useMemo, useState } from 'react'

const DonorTable = ({ donors, onContact, onSchedule }) => {
  const [bloodGroup, setBloodGroup] = useState('All')
  const [availability, setAvailability] = useState('All')
  const [maxDistance, setMaxDistance] = useState(10)
  const [search, setSearch] = useState('')

  const filteredDonors = useMemo(() => donors.filter((donor) => {
    const matchesSearch = donor.name.toLowerCase().includes(search.toLowerCase())
    const matchesBlood = bloodGroup === 'All' || donor.bloodGroup === bloodGroup
    const matchesAvailability = availability === 'All' || donor.availability === availability
    const matchesDistance = donor.distance <= maxDistance
    return matchesSearch && matchesBlood && matchesAvailability && matchesDistance
  }), [availability, bloodGroup, donors, maxDistance, search])

  return (
    <section className="hospital-dashboard__panel hospital-dashboard__panel--donors">
      <div className="hospital-dashboard__panel-heading">
        <div>
          <p className="hospital-dashboard__eyebrow">Matching</p>
          <h2>Donor Matching Center</h2>
        </div>
        <div className="hospital-dashboard__donor-filters">
          <select value={bloodGroup} onChange={(event) => setBloodGroup(event.target.value)} aria-label="Filter donors by blood group">
            <option value="All">All Groups</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
          <select value={availability} onChange={(event) => setAvailability(event.target.value)} aria-label="Filter donors by availability">
            <option value="All">All Availability</option>
            <option value="Available">Available</option>
            <option value="Busy">Busy</option>
            <option value="Unavailable">Unavailable</option>
          </select>
          <label className="hospital-dashboard__distance-filter">
            <span>Distance</span>
            <input type="range" min="1" max="10" value={maxDistance} onChange={(event) => setMaxDistance(Number(event.target.value))} />
            <strong>{maxDistance}km</strong>
          </label>
        </div>
      </div>

      <div className="hospital-dashboard__donor-search">
        <input type="search" placeholder="Search donor by name" value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      <div className="hospital-dashboard__table-wrap">
        <table className="hospital-dashboard__table">
          <thead>
            <tr>
              <th>Donor Name</th>
              <th>Blood Group</th>
              <th>Distance</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonors.map((donor) => (
              <tr key={donor.id}>
                <td><strong>{donor.name}</strong></td>
                <td>{donor.bloodGroup}</td>
                <td>{donor.distance}km</td>
                <td>
                  <span className={`hospital-dashboard__availability hospital-dashboard__availability--${donor.availability.toLowerCase()}`}>
                    {donor.availability}
                  </span>
                </td>
                <td>
                  <div className="hospital-dashboard__table-actions">
                    <button type="button" onClick={() => onContact(donor)}><Phone aria-hidden="true" /> Contact</button>
                    <button type="button" onClick={() => onSchedule(donor)}><CalendarPlus aria-hidden="true" /> Schedule</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default DonorTable
