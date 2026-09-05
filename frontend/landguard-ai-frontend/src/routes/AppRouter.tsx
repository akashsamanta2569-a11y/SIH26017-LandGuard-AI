import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";

import Dashboard from "../pages/Dashboard";
import Heatmap from "../pages/Heatmap";
import Alerts from "../pages/Alerts";
import PredictionHistory from "../pages/PredictionHistory";
import GisMap from "../pages/GisMap";
import Projects from "../pages/Projects";
import AIDetection from "../pages/AIDetection";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/heatmap" element={<Heatmap />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/prediction" element={<AIDetection />} />
          <Route path="/history" element={<PredictionHistory />} />
          <Route path="/gis" element={<GisMap />} />
          <Route path="/prediction" element={<AIDetection />} />
          <Route path="/projects" element={<Projects />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}