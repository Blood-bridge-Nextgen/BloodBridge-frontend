import { Routes, Route, useNavigate } from "react-router-dom";
import CreateDonorAccount from "./Components/Auth/CreateDonorProfile";
import CreateHospitalAccount from "./Components/Auth/CreatHospitalAccount";
import DonorSignup from "./Components/Auth/DonorSignup";
import HospitalSignup from "./Components/Auth/HospitalSignup";
import OnboardingScreen from "./Components/Auth/OnboardingScreen";
import SignIn from "./Components/Auth/SignIn";
import Contact from "./Components/Contact";
import DonorDashboard from "./Components/Dashboards/DonorDashboard";
import DonorProfile from "./Components/Dashboards/DonorProfile";
import Features from "./Components/Features";
import Footer from "./Components/Footer";
import HeroSection from "./Components/HeroSection";
import StatisticSection from "./Components/Statistic-section";
import StepsSection from "./Components/StepsSection";
import Trust from "./Components/Trust";
import useRevealOnScroll from "./hooks/useRevealOnScroll";

const SignInRoute = () => {
  return <SignIn />;
};

function App() {
  useRevealOnScroll();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <HeroSection />
            <StatisticSection />
            <StepsSection />
            <Features />
            <Trust />
            <Footer />
          </>
        }
      />
      <Route path="/CreateDonorProfile" element={<CreateDonorAccount />} />
      <Route
        path="/CreateHospitalAccount"
        element={<CreateHospitalAccount />}
      />
      <Route path="/OnboardingScreen" element={<OnboardingScreen />} />
      <Route path="/DonorDashboard" element={<DonorDashboard />} />
      <Route path="/DonorDashboard/profile" element={<DonorProfile />} />
      <Route path="/Contact" element={<Contact />} />
      <Route path="/DonorSignup" element={<DonorSignup />} />
      <Route path="/HospitalSignup" element={<HospitalSignup />} />
      <Route path="/SignIn" element={<SignInRoute />} />
    </Routes>
  );
}

export default App;
