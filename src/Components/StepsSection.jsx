import { LuActivity, LuCircleCheck, LuClipboardList, LuUsers } from 'react-icons/lu'

const workflowSteps = [
  {
    number: '01',
    title: 'Register as a Donor',
    description: 'Create your secure profile, input your verified medical history, and join the active national life-saving network.',
    Icon: LuUsers,
  },
  {
    number: '02',
    title: 'Verify Blood Request',
    description: 'Hospitals and family units submit urgent requests. Our clinical triage system verifies credentials in real time.',
    Icon: LuClipboardList,
  },
  {
    number: '03',
    title: 'Smart Triage Matching',
    description: 'Our automated dispatch immediately matches requests with fully compatible, nearby donors based on location.',
    Icon: LuActivity,
  },
  {
    number: '04',
    title: 'Confirmation & Delivery',
    description: 'Confirm donation dispatch, monitor delivery tracking, and update the medical record automatically.',
    Icon: LuCircleCheck,
  },
]

const StepsSection = () => {
  return (
    <section id='StepsSection' className="workflow-section" aria-labelledby="workflow-title">
      <div className="workflow-container">
        <header className="workflow-heading">
          <p className="workflow-badge">
            <LuClipboardList aria-hidden="true" />
            COORDINATION WORKFLOW
          </p>
          <h2 className="workflow-title" id="workflow-title">How BloodBridge Works</h2>
          <p className="workflow-subtitle">
            An institutional network designed for secure medical coordination and maximum response speed during critical shortages.
          </p>
        </header>
        <ol className="workflow-grid">
          {workflowSteps.map(({ number, title, description, Icon }) => (
            <li className="workflow-step" key={number}>
              <span className="workflow-number">{number}</span>
              <div className="workflow-content">
                <div className="workflow-title-row">
                  <span className="workflow-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <h3>{title}</h3>
                </div>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default StepsSection