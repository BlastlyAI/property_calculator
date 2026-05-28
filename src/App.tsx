import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Homepage } from './pages/Homepage';
import { CalcScreen1 } from './pages/CalcScreen1';
import { CalcScreen2 } from './pages/CalcScreen2';
import { CalcScreen3 } from './pages/CalcScreen3';
import { CalcScreen4 } from './pages/CalcScreen4';
import { CalcScreen5 } from './pages/CalcScreen5';
import { CalcConfirm } from './pages/CalcConfirm';
import { EmbedDemo } from './pages/EmbedDemo';

// Business Onboarding Flow
import { BusinessSignup } from './pages/BusinessSignup';
import { BusinessPreview } from './pages/BusinessPreview';
import { BusinessSuccess } from './pages/BusinessSuccess';
import { BusinessUpsell } from './pages/BusinessUpsell';
import { BusinessDashboard } from './pages/BusinessDashboard';
import { BusinessDemoCalculator } from './pages/BusinessDemoCalculator';

export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/calculator" element={<Navigate to="/calculator/1" replace />} />
      <Route path="/calculator/1" element={<CalcScreen1 />} />
      <Route path="/calculator/2" element={<CalcScreen2 />} />
      <Route path="/calculator/3" element={<CalcScreen3 />} />
      <Route path="/calculator/4" element={<CalcScreen4 />} />
      <Route path="/calculator/5" element={<CalcScreen5 />} />
      <Route path="/calculator/confirm" element={<CalcConfirm />} />
      <Route path="/embed-demo" element={<EmbedDemo />} />

      {/* Business Onboarding Flow */}
      <Route path="/business/signup" element={<BusinessSignup />} />
      <Route path="/business/preview" element={<BusinessPreview />} />
      <Route path="/business/success" element={<BusinessSuccess />} />
      <Route path="/business/upsell" element={<BusinessUpsell />} />
      <Route path="/business/dashboard" element={<BusinessDashboard />} />
      <Route path="/business/demo-calculator" element={<BusinessDemoCalculator />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </BrowserRouter>
  );
}
