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
const routesConfig = [
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/admin", element: <AdminPage />, protected: true, role: 'Admin' },
  { path: "/response", element: <ResponseTeam />, protected: true, role: 'Response' },
  { path: "/", element: <Home />, protected: true },
  { path: "/ComplaintReport", element: <ComplaintReport />, protected: true },
  { path: "/EmergencyReport", element: <EmergencyReport />, protected: true },
];

const AppRoutes = () => {
  const { loading } = useAuth();
  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        {routesConfig.map(({ path, element, protected: isProtected, role }) => (
          <Route
            key={path}
            path={path}
            element={
              isProtected ? (
                role ? (
                  <RoleProtectedRoute allowedRoles={[role]}>{element}</RoleProtectedRoute>
                ) : (
                  <ProtectedRoute>{element}</ProtectedRoute>
                )
              ) : (
                element
              )
            }
          />
        ))}
      </Routes>
    </Router>
  );
};
export default App;
