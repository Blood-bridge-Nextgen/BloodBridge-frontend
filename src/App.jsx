import HeroSection from './Components/HeroSection'
import StatisticSection from './Components/Statistic-section'
import Features from './Components/Features'
import Trust from './Components/Trust'
import StepsSection from './Components/StepsSection';
import Footer from './Components/Footer'
import useRevealOnScroll from './hooks/useRevealOnScroll'

function App() {
  useRevealOnScroll() // custom hook to reveal elements on scroll
  return (
    <>
      <HeroSection />
      <StatisticSection />
      <StepsSection />
      <Features />
      <Trust />
      <Footer />
    </>
  )
}

export default App;