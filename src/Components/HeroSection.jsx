import { LuActivity } from "react-icons/lu";
import { LuShieldCheck } from "react-icons/lu";
import { Link } from "react-router-dom";
import Header from './Header'

const HeroSection = () => {
  return (
    <>
      <Header />
      <div className="hero-section alignment-container">
        <div className="hero-text-block">
          <div className="hero-headlines">
            <p className='section-badge'>
              <LuActivity className="section-badge-icon" aria-hidden="true" /> PLATFORM VERIFIED NETWORK</p>
            <h1>Connecting Blood Donors with Life-Saving Requests</h1>
            <p>BloodBridge helps verified donors, hospitals, and blood banks respond to critical blood needs quickly, safely, and efficiently. Our direct coordination pipeline reduces delays in medical emergencies.</p>
          </div>
          <div className="button">
            <Link className="primary" to="/DonorSignup">Become a Donor</Link>
            <Link className="secondary" to="/HospitalSignup">Request Blood</Link>
          </div>
          <div className="hero-footnote">
            <p><LuShieldCheck className="section-badge-icon" aria-hidden="true" /> Fully compliant with national healthcare coordination security standards.</p>
          </div>
        </div>
        <div className="hero-imagery">
          <img src="src/assets/blood-donation.jpg" alt="" />
        </div>
      </div>
    </>
  )
}

export default HeroSection