// src/pages/UserReport.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import EmergencyForm from '../components/EmergencyForm';
import ComplaintForm from '../components/FormPropsTextFields';

const UserReport = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const reportType = searchParams.get('type');

  return (
    <div>
      <Navbar />
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        {reportType === 'complaint' ? <ComplaintForm /> : <EmergencyForm />}
      </div>
    </div>
  );
};

export default UserReport;
