import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { HomePage } from './pages/HomePage';
import { IS_PRIVATE_PREVIEW } from './data/site';

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
const DispatchPage = lazy(() =>
  import('./pages/DispatchPage').then((m) => ({ default: m.DispatchPage })),
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
          {IS_PRIVATE_PREVIEW && (
            <div className="private-preview-banner" role="status">
              PRIVATE PREVIEW · Not public · Form delivery and analytics disabled
            </div>
          )}
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/field-guide" element={<FieldGuidePage />} />
              <Route path="/2026" element={<YearReviewPage />} />
              <Route path="/route/:ventureId" element={<VentureRoutePage />} />
              <Route path="/dispatch/:slug" element={<DispatchPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;