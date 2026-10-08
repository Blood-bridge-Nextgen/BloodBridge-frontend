import { Search, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import RequestCard from './RequestCard'

const ActiveRequests = ({ requests, onFulfill, onDelete, onContact }) => {
  const [filter, setFilter] = useState('All')
  const filteredRequests = useMemo(() => {
    if (filter === 'All') return requests
    return requests.filter((request) => request.status === filter)
  }, [filter, requests])

  return (
    <section className="hospital-dashboard__panel hospital-dashboard__panel--requests">
      <div className="hospital-dashboard__panel-heading">
        <div>
          <p className="hospital-dashboard__eyebrow">Operations</p>
          <h2>Active Requests</h2>
        </div>
        <div className="hospital-dashboard__toolbar">
          <button className="hospital-dashboard__filter-button" type="button" onClick={() => setFilter('All')}>
            <SlidersHorizontal aria-hidden="true" /> Filters
          </button>
          <label className="hospital-dashboard__search">
            <Search aria-hidden="true" />
            <input type="search" placeholder="Search requests" aria-label="Search requests" />
          </label>
        </div>
      </div>

      <div className="hospital-dashboard__request-filters" role="tablist" aria-label="Request status filters">
        {['All', 'Pending', 'Fulfilled'].map((option) => (
          <button
            key={option}
            type="button"
            className={`hospital-dashboard__filter-pill${filter === option ? ' hospital-dashboard__filter-pill--active' : ''}`}
            onClick={() => setFilter(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="hospital-dashboard__request-list">
        {filteredRequests.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            onFulfill={onFulfill}
            onDelete={onDelete}
            onContact={onContact}
          />
        ))}
      </div>
    </section>
  )
}

export default ActiveRequests
