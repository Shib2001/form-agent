import { Routes, Route } from "react-router-dom";
import OnboardingForm from "./OnboardingForm";
import EngagementLetterPage from "./EngagementLetterPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<OnboardingForm />} />
      <Route path="/engagement-letter" element={<EngagementLetterPage />} />
    </Routes>
  );
}

export default App;

