import { Route, Routes } from "react-router-dom";

import SolarMain from "./pages/solarMain";
import BiomassMain from "./pages/biomassMain";
import IntegralMain from "./pages/integralMain";

export default function App() {

  return (
    <Routes>
      <Route exact path="/" element={<IntegralMain />} />
      <Route path="biomass" element={<BiomassMain />} />
      <Route path="solar" element={<SolarMain />} />
      <Route path="integral" element={<IntegralMain />} />
    </Routes>
  );
}
