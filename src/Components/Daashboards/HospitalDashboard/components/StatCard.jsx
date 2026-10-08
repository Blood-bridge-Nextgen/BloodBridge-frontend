const StatCard = ({ label, value, description, tone = 'default' }) => (
  <article className={`hospital-dashboard__stat-card hospital-dashboard__stat-card--${tone}`}>
    <span className="hospital-dashboard__stat-label">{label}</span>
    <strong className="hospital-dashboard__stat-value">{value}</strong>
    <span className="hospital-dashboard__stat-description">{description}</span>
  </article>
)

export default StatCard
