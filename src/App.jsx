import { Routes, Route } from "react-router-dom";
import OnboardingForm from "./OnboardingForm";
import AgreementSign from "./AgreementSign";
import ThankYou from "./thank-you";

function App() {
  return (
    <Routes>
      <Route path="/" element={<OnboardingForm />} />
      <Route path="/agreement-sign" element={<AgreementSign/>} />
      <Route path="/thank-you" element={<ThankYou />} />
    </Routes>
  );
}

export default App;

