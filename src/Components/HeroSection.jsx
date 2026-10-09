import { LuActivity, LuShieldCheck } from "react-icons/lu";
import { Link } from "react-router-dom";
import heroImage from "../assets/blood-donation.jpg";
import Header from "./Header";

const HeroSection = () => {
  return (
    <>
      <Header />
      <div className="hero-section alignment-container">
        <div className="hero-text-block">
          <div className="hero-headlines">
            <p className="section-badge">
              <LuActivity className="section-badge-icon" aria-hidden="true" />{" "}
              PLATFORM VERIFIED NETWORK
            </p>
            <h1>Connecting Blood Donors with Life-Saving Requests</h1>
            <p>
              BloodBridge helps verified donors, hospitals, and blood banks
              respond to critical blood needs quickly, safely, and efficiently.
              Our direct coordination pipeline reduces delays in medical
              emergencies.
            </p>
          </div>
          <div className="button">
            <Link
              className="primary"
              to="https://bloodbridge-dashboard.pxxl.pro/sign-up/donor"
              target="_blank"
            >
              Become a Donor
            </Link>
            <Link
              target="_blank"
              className="secondary"
              to="https://bloodbridge-dashboard.pxxl.pro/sign-up/facility"
            >
              Request Blood
            </Link>
          </div>
          <div className="hero-footnote">
            <p>
              <LuShieldCheck
                className="section-badge-icon"
                aria-hidden="true"
              />{" "}
              Fully compliant with national healthcare coordination security
              standards.
            </p>
          </div>
        </div>
        <div className="hero-imagery">
          <img src={heroImage} alt="" />
        </div>
      </div>
    </>
  );
};

export default HeroSection;
