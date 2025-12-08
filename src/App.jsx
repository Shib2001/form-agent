import { Routes, Route } from "react-router-dom";
import OnboardingForm from "./OnboardingForm";
import AgreementSign from "./AgreementSign";
import ThankYou from "./thank-you";
import AgreementSigned from "./AgreementSigned";

function App() {
  return (
    <Routes>
      <Route path="/" element={<OnboardingForm />} />
      <Route path="/agreement-sign" element={<AgreementSign/>} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/agreement-signed" element={<AgreementSigned />} />
    </Routes>
  );
}

export default App;

