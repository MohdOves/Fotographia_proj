import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import AddProjectPage from './pages/AddProjectPage';
import FaceMatchPage from './pages/FaceMatchPage';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/:section" element={<DashboardPage />} />
        <Route path="/dashboard/add" element={<AddProjectPage />} />
        <Route path="/face-match" element={<FaceMatchPage />} />
        <Route path="*" element={<SignInPage />} />
      </Routes>
    </Router>
  );
}

export default App;
