import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from '../src/pages/LoginPage';
import Dashboard from '../src/pages/Dashboard';
import ChartWithTable from '../src/components/ChartWithTable';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ChartWithTable" element={<ChartWithTable />} />
      </Routes>
    </Router>
  );
}

export default App;
