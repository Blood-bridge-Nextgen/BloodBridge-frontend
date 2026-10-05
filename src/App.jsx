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
import OnBoard from './Components/Auth/OnBoard' 
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
      <Route path="/Onboard" element={<OnBoard />} />
      <Route path="/Contact" element={<Contact />} />
    </Routes>
  )
}

export default App