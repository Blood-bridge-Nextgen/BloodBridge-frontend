import React from 'react'
import Header from '../Components/Header'

const HeroSection = () => {
  return (
    <>
      <Header />
      <div className="hero-section">
        <div className="hero-text-block">
          <div className="hero-headlines">
            <p className='section-badge'>PLATFORM VERIFIED NETWORK</p>
            <h1>Connecting Blood Donors with Life-Saving Requests</h1>
            <p>BloodBridge helps verified donors, hospitals, and blood banks respond to critical blood needs quickly, safely, and efficiently. Our direct coordination pipeline reduces delays in medical emergencies.</p>
          </div>
          {/* <div className="button" style={{
            "gap" : '10px',
          }}>
            <button>Become a Donor</button>
            <button>Request Blood</button>
          </div> */}
          <div className="hero-footnote">
            <p>Fully compliant with national healthcare coordination security standards.</p>
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