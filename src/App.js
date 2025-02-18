import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Pages/Login';
import AdminPage from './Pages/Admin';
import { RolePage } from './Pages/RolePage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/role" element={<RolePage />} />

      </Routes>
    </Router>
  );
}
