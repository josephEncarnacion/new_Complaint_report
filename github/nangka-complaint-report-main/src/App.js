import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ComplaintReport from './pages/ComplaintReport';
import EmergencyReport from './pages/EmergencyReport'
import Login from  './pages/login';
import Register from './pages/register';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPage from './pages/AdminPage';
import ResponseTeam from './pages/ResponseTeam';

const App = () => {
  useEffect(() => {
    const getData = async (url) => {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newData = await response.json();
        console.log(newData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getData('http://localhost:5000/api');  // Ensure the URL is correct
  }, []);

  
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/response" element={<ResponseTeam />} />

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
  </AuthProvider>
  );
};

export default App;
