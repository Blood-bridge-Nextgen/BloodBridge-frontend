import { Link } from 'react-router-dom'


const OnBoard = () => {
  return (
    <div className='Welcome-screen'>
      <div className="logo-block"></div>
      <div className="role-selection"></div>
      <div className="button">
        <Link to="/CreateDonorAccount" className="primary">Continue as Donor</Link>
        <Link to="/CreateHospitalAccount" className="secondary">Hospital</Link>
      </div>
    </div>
  )
}

export default OnBoard