import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { FieldGuidePage } from './pages/FieldGuidePage';
import { YearReviewPage } from './pages/YearReviewPage';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/field-guide" element={<FieldGuidePage />} />
          <Route path="/2026" element={<YearReviewPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;