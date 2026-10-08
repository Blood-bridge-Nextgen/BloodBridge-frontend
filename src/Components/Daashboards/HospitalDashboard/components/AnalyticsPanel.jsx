const requestTypes = [
  { name: 'Emergency', value: 42, color: 'red' },
  { name: 'Scheduled', value: 31, color: 'green' },
  { name: 'Surgery', value: 18, color: 'orange' },
  { name: 'Maternity', value: 9, color: 'gray' },
]

const AnalyticsPanel = ({ analytics }) => (
  <aside className="hospital-dashboard__panel hospital-dashboard__panel--analytics">
    <div className="hospital-dashboard__panel-heading hospital-dashboard__panel-heading--tight">
      <div>
        <p className="hospital-dashboard__eyebrow">Performance</p>
        <h2>Analytics</h2>
      </div>
    </div>

    <div className="hospital-dashboard__analytics-grid">
      <div className="hospital-dashboard__analytics-card">
        <span>Average response time</span>
        <strong>{analytics.averageResponseTime}</strong>
        <small>This Month</small>
      </div>
      <div className="hospital-dashboard__analytics-card">
        <span>Fulfillment Rate</span>
        <strong>{analytics.fulfillmentRate}</strong>
      </div>
    </div>

    <div className="hospital-dashboard__request-types">
      {requestTypes.map(({ name, value, color }) => (
        <div key={name} className="hospital-dashboard__request-type">
          <div className="hospital-dashboard__request-type-header">
            <span>{name}</span>
            <strong>{value}%</strong>
          </div>
          <div className="hospital-dashboard__request-type-bar" aria-hidden="true">
            <span className={`hospital-dashboard__request-type-fill hospital-dashboard__request-type-fill--${color}`} style={{ width: `${value}%` }} />
          </div>
        </div>
      ))}
    </div>

    <div className="hospital-dashboard__monthly-chart" aria-label="Monthly donations chart">
      {[55, 70, 62, 90, 74, 82, 96].map((value, index) => (
        <div key={index} className="hospital-dashboard__monthly-bar">
          <span style={{ height: `${value}%` }} aria-hidden="true" />
          <label>{['J', 'F', 'M', 'A', 'M', 'J', 'J'][index]}</label>
        </div>
      ))}
    </div>
  </aside>
)

export default AnalyticsPanel
