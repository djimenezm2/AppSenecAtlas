// Import routing components from React Router
import { Route, Routes } from "react-router-dom";

// Import main pages of the app
import Index from "./pages/index";
import SolarMain from "./pages/solarMain";
import BiomassMain from "./pages/biomassMain";
import IntegralMain from "./pages/integralMain";

// Main component that defines the application routes
export default function App() {
  return (
    <Routes>
      {/* Home page */}
      <Route path="/senecatlas" element={<Index />} />
      <Route path="/senecatlas/" element={<Index />} />

      {/* Biomass page */}
      <Route path="/senecatlas/biomass" element={<BiomassMain />} />

      {/* Solar page */}
      <Route path="/senecatlas/solar" element={<SolarMain />} />

      {/* Integral page */}
      <Route path="/senecatlas/integral" element={<IntegralMain />} />
    </Routes>
  );
}
