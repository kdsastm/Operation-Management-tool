import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Dashboard";
import RevenueDash from "./pages/RevenueDash";
import FullViewChart from "./pages/FullViewChart";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/revenue-dash" element={<RevenueDash />} />
        <Route path="/full-view-chart" element={<FullViewChart />} />
      </Routes>
    </Router>
  );
};

export default App;
