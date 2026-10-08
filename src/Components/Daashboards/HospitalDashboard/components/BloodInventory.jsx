const statusConfig = {
  Healthy: { tone: 'healthy', label: 'Healthy' },
  Low: { tone: 'low', label: 'Low' },
  Critical: { tone: 'critical', label: 'Critical' },
}

const BloodInventory = ({ inventory }) => (
  <aside className="hospital-dashboard__panel hospital-dashboard__panel--inventory">
    <div className="hospital-dashboard__panel-heading hospital-dashboard__panel-heading--tight">
      <div>
        <p className="hospital-dashboard__eyebrow">Supply</p>
        <h2>Blood Inventory</h2>
      </div>
    </div>

    <div className="hospital-dashboard__inventory-list">
      {inventory.map(({ group, units, status }) => {
        const config = statusConfig[status]
        const percentage = Math.min((units / 150) * 100, 100)

        return (
          <div key={group} className="hospital-dashboard__inventory-item">
            <div className="hospital-dashboard__inventory-row">
              <strong>{group}</strong>
              <span>{units} Units</span>
            </div>
            <div className="hospital-dashboard__inventory-bar" aria-hidden="true">
              <span style={{ width: `${percentage}%` }} className={`hospital-dashboard__inventory-fill hospital-dashboard__inventory-fill--${config.tone}`} />
            </div>
            <div className="hospital-dashboard__inventory-status">
              <span className={`hospital-dashboard__status-dot hospital-dashboard__status-dot--${config.tone}`} />
              {config.label}
            </div>
          </div>
        )
      })}
    </div>
  </aside>
)

export default BloodInventory
