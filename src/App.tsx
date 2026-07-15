import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Analytics } from './components/Analytics';
import { HomePage } from './pages/HomePage';

const PrivacyPage = lazy(() =>
  import('./pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage })),
);
const TermsPage = lazy(() =>
  import('./pages/TermsPage').then((m) => ({ default: m.TermsPage })),
);
const FieldGuidePage = lazy(() =>
  import('./pages/FieldGuidePage').then((m) => ({ default: m.FieldGuidePage })),
);
const YearReviewPage = lazy(() =>
  import('./pages/YearReviewPage').then((m) => ({ default: m.YearReviewPage })),
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);
const VentureRoutePage = lazy(() =>
  import('./pages/VentureRoutePage').then((m) => ({ default: m.VentureRoutePage })),
);

function PageFallback() {
  return (
    <div className="page-loading" role="status" aria-live="polite">
      Loading route…
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="app-container">
          <Analytics />
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/field-guide" element={<FieldGuidePage />} />
              <Route path="/2026" element={<YearReviewPage />} />
              <Route path="/route/:ventureId" element={<VentureRoutePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;