const AuditLog = ({ logs }) => (
  <aside className="hospital-dashboard__panel hospital-dashboard__panel--audit">
    <div className="hospital-dashboard__panel-heading hospital-dashboard__panel-heading--tight">
      <div>
        <p className="hospital-dashboard__eyebrow">Records</p>
        <h2>Audit Log</h2>
      </div>
    </div>

    <ol className="hospital-dashboard__audit-list">
      {logs.map((log) => (
        <li key={log.id} className="hospital-dashboard__audit-item">
          <span className="hospital-dashboard__audit-dot" aria-hidden="true" />
          <div>
            <strong>{log.action}</strong>
            <div className="hospital-dashboard__audit-meta">
              <time>{log.timestamp}</time>
              <span>{log.user}</span>
            </div>
          </div>
        </li>
      ))}
    </ol>
  </aside>
)

export default AuditLog
