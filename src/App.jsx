import React from 'react'
import { Routes, Route } from 'react-router-dom'
import useRevealOnScroll from './hooks/useRevealOnScroll'
import HeroSection from './Components/HeroSection'
import StatisticSection from './Components/Statistic-section'
import StepsSection from './Components/StepsSection'
import Features from './Components/Features'
import Trust from './Components/Trust'
import Footer from './Components/Footer'
import CreateDonorAccount from './Components/Auth/CreateDonorAccount'
import CreateHospitalAccount from './Components/Auth/CreatHospitalAccount'
import OnboardingScreen from './Components/Auth/OnboardingScreen' 
import DonorDashboard from './Components/Dashboards/DonorDashboard'
import DonorProfile from './Components/Dashboards/DonorProfile'
import DonorSignup from './Components/Auth/DonorSignup'
import HospitalSignup from './Components/Auth/HospitalSignup'
import Contact from './Components/Contact'

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
      <Route path="/CreateDonorAccount" element={<CreateDonorAccount />} />
      <Route path="/CreateHospitalAccount" element={<CreateHospitalAccount />} />
      <Route path="/OnboardingScreen" element={<OnboardingScreen />} />
      <Route path="/DonorDashboard" element={<DonorDashboard />} />
      <Route path="/DonorDashboard/profile" element={<DonorProfile />} />
      <Route path="/Contact" element={<Contact />} />
      <Route path="/DonorSignup" element={<DonorSignup />} />
      <Route path="/HospitalSignup" element={<HospitalSignup />} />
    </Routes>
  )
}

export default App