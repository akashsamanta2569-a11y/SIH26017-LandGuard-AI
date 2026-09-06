import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";

import Dashboard from "../pages/Dashboard";
import Heatmap from "../pages/Heatmap";
import Alerts from "../pages/Alerts";
import PredictionHistory from "../pages/PredictionHistory";
import GisMap from "../pages/GisMap";
import Projects from "../pages/Projects";
import Prediction from "../pages/Prediction";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/gis" element={<GisMap />} />
          <Route path="/heatmap" element={<Heatmap />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/history" element={<PredictionHistory />} />
          <Route path="/prediction-history" element={<PredictionHistory />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/projects" element={<Projects />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}