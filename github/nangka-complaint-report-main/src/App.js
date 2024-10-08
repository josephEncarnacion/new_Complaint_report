// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ComplaintReport from './pages/ComplaintReport';
import EmergencyReport from './pages/EmergencyReport';
import Login from './pages/login';
import Register from './pages/register';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPage from './pages/AdminPage';
import ResponseTeam from './pages/ResponseTeam';

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

// Separate the routes logic to handle loading from AuthContext
const AppRoutes = () => {
  const { loading } = useAuth();  // Get the loading state from AuthContext

  if (loading) {
    // Display a loading spinner or message while the auth state is loading
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={
          <RoleProtectedRoute allowedRoles={['Admin']}>
            <AdminPage />
          </RoleProtectedRoute>
        } />
        <Route path="/response" element={
          <RoleProtectedRoute allowedRoles={['Response']}>
            <ResponseTeam />
          </RoleProtectedRoute>
        } />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="ComplaintReport" element={<ComplaintReport />} />
                <Route path="EmergencyReport" element={<EmergencyReport />} />
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
