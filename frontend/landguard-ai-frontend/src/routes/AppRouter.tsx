import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";

import Dashboard from "../pages/Dashboard";
import Heatmap from "../pages/Heatmap";
import Alerts from "../pages/Alerts";
import Prediction from "../pages/Prediction";
import PredictionHistory from "../pages/PredictionHistory";
import GisMap from "../pages/GisMap";
import Projects from "../pages/Projects";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/heatmap" element={<Heatmap />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/history" element={<PredictionHistory />} />
          <Route path="/gis" element={<GisMap />} />
          <Route path="/projects" element={<Projects />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}