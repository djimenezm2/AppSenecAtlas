import { Route, Routes } from "react-router-dom";

import SolarMain from "./pages/solarMain";
import BiomassMain from "./pages/biomassMain";
import IntegralMain from "./pages/integralMain";

export default function App() {

  return (
    <Routes>
      <Route exact path="/senecatlas/" element={<IntegralMain />} />
      <Route path="/senecatlas/biomass" element={<BiomassMain />} />
      <Route path="/senecatlas/solar" element={<SolarMain />} />
      <Route path="/senecatlas/integral" element={<IntegralMain />} />
    </Routes>
  );
}
