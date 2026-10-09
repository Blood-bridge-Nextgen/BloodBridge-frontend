import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import useRevealOnScroll from "./hooks/useRevealOnScroll";
import HeroSection from "./Components/HeroSection";
import StatisticSection from "./Components/Statistic-section";
import StepsSection from "./Components/StepsSection";
import Features from "./Components/Features";
import Trust from "./Components/Trust";
import Footer from "./Components/Footer";
import CreateDonorAccount from "./Components/Auth/CreateDonorProfile";
import CreateHospitalAccount from "./Components/Auth/CreatHospitalAccount";
import OnboardingScreen from "./Components/Auth/OnboardingScreen";
import DonorDashboard from "./Components/Daashboards/DonorDashboard/DonorDashboard";
import DonorProfile from "./Components/Daashboards/DonorDashboard/DonorProfile";
import DonorSignup from "./Components/Auth/DonorSignup";
import HospitalSignup from "./Components/Auth/HospitalSignup";
import { SignInRoute } from "./Components/Auth/SignIn";
import ResetPassword from "./Components/Auth/ResetPassword";
import VerifyResetOtp from "./Components/Auth/VerifyResetOtp";
import HospitalDashboard from "./Components/Daashboards/HospitalDashboard/HospitalDashboard";
import Contact from "./Components/Contact";
import { sendPasswordReset } from "./api/authApi";
import OtpVerification from "./Components/Auth/OtpVerification";

const ResetPasswordRoute = () => {
  const navigate = useNavigate();

  return (
    <ResetPassword
      onBackToSignIn={() => navigate("/SignIn")}
      onSubmit={async (email) => {
        await sendPasswordReset(email);
        navigate("/VerifyResetOtp", { state: { email } });
      }}
    />
  );
};

const VerifyResetOtpRoute = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  return (
    <VerifyResetOtp
      email={state?.email}
      onBack={() => navigate("/ResetPassword")}
      onChangeEmail={() => navigate("/ResetPassword")}
      onBackToSignIn={() => navigate("/SignIn")}
      onVerified={(data) => navigate("/SetNewPassword", { state: data })}
    />
  );
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
      <Route path="/verify-otp" element={<OtpVerification />} />
      <Route path="/ResetPassword" element={<ResetPasswordRoute />} />
      <Route path="/VerifyResetOtp" element={<VerifyResetOtpRoute />} />
      <Route path="/HospitalDashboard" element={<HospitalDashboard />} />
    </Routes>
  );
}

export default App;
