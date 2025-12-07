import { Routes, Route } from "react-router-dom";
import OnboardingForm from "./OnboardingForm";
import AgreementSign from "./AgreementSign";

function App() {
  return (
    <Routes>
      <Route path="/" element={<OnboardingForm />} />
      <Route path="/agreement-sign" element={<AgreementSign/>} />
    </Routes>
  );
}

export default App;

