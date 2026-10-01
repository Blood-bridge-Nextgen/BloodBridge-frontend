import { LuCircleCheck, LuHeartHandshake, LuHospital, LuUsers } from 'react-icons/lu'

const statistics = [
  { value: '50,000+', label: 'Registered Donors', Icon: LuUsers },
  { value: '1,200+', label: 'Hospitals Connected', Icon: LuHospital },
  { value: '98,000+', label: 'Requests Fulfilled', Icon: LuCircleCheck },
  { value: '150,000+', label: 'Lives Impacted', Icon: LuHeartHandshake },
]

const StatisticSection = () => {
  return (
    <section className="statistics-section" aria-label="BloodBridge impact">
      <ul className="statistics-grid">
        {statistics.map(({ value, label, Icon }) => (
          <li className="statistic-card" key={label}>
            <div className="statistic-copy">
              <strong className="statistic-value">{value}</strong>
              <span className="statistic-label">{label}</span>
            </div>
            <span className="statistic-icon" aria-hidden="true">
              <Icon />
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default StatisticSection