import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Box, Typography, Button
} from '@mui/material';
import CustomPaginationActions from '../components/CustomPaginationActions';
import MapComponent from '../components/MapComponent';

const AdminPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [complaintPage, setComplaintPage] = useState(0);
  const [complaintRowsPerPage, setComplaintRowsPerPage] = useState(10);
  const [emergencyPage, setEmergencyPage] = useState(0);
  const [emergencyRowsPerPage, setEmergencyRowsPerPage] = useState(10);

  useEffect(() => {
    fetchComplaints(complaintPage, complaintRowsPerPage);
  }, [complaintPage, complaintRowsPerPage]);

  useEffect(() => {
    fetchEmergencies(emergencyPage, emergencyRowsPerPage);
  }, [emergencyPage, emergencyRowsPerPage]);

  const fetchComplaints = async (page, pageSize) => {
    const response = await fetch(`/complaints?page=${page + 1}&pageSize=${pageSize}`);
    const data = await response.json();
    setComplaints(data);
  };

  const fetchEmergencies = async (page, pageSize) => {
    const response = await fetch(`/emergencies?page=${page + 1}&pageSize=${pageSize}`);
    const data = await response.json();
    setEmergencies(data);
  };

  const handleDeleteComplaint = async (name) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      const response = await fetch(`/complaints/${name}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        fetchComplaints(complaintPage, complaintRowsPerPage);
      } else {
        alert('Failed to delete complaint');
      }
    }
  };

  const handleConfirmComplaint = async (name) => {
    if (window.confirm('Are you sure you want to confirm this complaint?')) {
      const response = await fetch(`/complaints/confirm/${name}`, { method: 'POST' });
      const result = await response.json();
      if (result.success) {
        fetchComplaints(complaintPage, complaintRowsPerPage);
      } else {
        alert('Failed to confirm complaint');
      }
    }
  };

  const handleDeleteEmergency = async (name) => {
    if (window.confirm('Are you sure you want to delete this emergency?')) {
      const response = await fetch(`/emergencies/${name}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        fetchEmergencies(emergencyPage, emergencyRowsPerPage);
      } else {
        alert('Failed to delete emergency');
      }
    }
  };

  const handleConfirmEmergency = async (name) => {
    if (window.confirm('Are you sure you want to confirm this emergency?')) {
      const response = await fetch(`/emergencies/confirm/${name}`, { method: 'POST' });
      const result = await response.json();
      if (result.success) {
        fetchEmergencies(emergencyPage, emergencyRowsPerPage);
      } else {
        alert('Failed to confirm emergency');
      }
    }
  };

  const handleComplaintPageChange = (event, newPage) => {
    setComplaintPage(newPage);
  };

  const handleComplaintRowsPerPageChange = (event) => {
    setComplaintRowsPerPage(parseInt(event.target.value, 10));
    setComplaintPage(0);
  };

  const handleEmergencyPageChange = (event, newPage) => {
    setEmergencyPage(newPage);
  };

  const handleEmergencyRowsPerPageChange = (event) => {
    setEmergencyRowsPerPage(parseInt(event.target.value, 10));
    setEmergencyPage(0);
  };

  return (
    <Box sx={{ padding: 4 }}>
            
        <Typography variant="h4" gutterBottom>
        Maps
      </Typography>
      <MapComponent/>
      <Typography variant="h4" gutterBottom>
        Complaints
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {complaints.map((complaint) => (
              <TableRow key={complaint.Name}>
                <TableCell>{complaint.Name}</TableCell>
                <TableCell>{complaint.Address}</TableCell>
                <TableCell>{complaint.ComplaintType}</TableCell>
                <TableCell>{complaint.ComplaintText}</TableCell>
                <TableCell>
                  <Button onClick={() => handleConfirmComplaint(complaint.Name)}>Confirm</Button>
                  <Button onClick={() => handleDeleteComplaint(complaint.Name)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={complaints.length}
        page={complaintPage}
        onPageChange={handleComplaintPageChange}
        rowsPerPage={complaintRowsPerPage}
        onRowsPerPageChange={handleComplaintRowsPerPageChange}
        ActionsComponent={CustomPaginationActions}
      />

      <Typography variant="h4" gutterBottom>
        Emergencies
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {emergencies.map((emergency) => (
              <TableRow key={emergency.Name}>
                <TableCell>{emergency.Name}</TableCell>
                <TableCell>{emergency.Address}</TableCell>
                <TableCell>{emergency.EmergencyType}</TableCell>
                <TableCell>{emergency.EmergencyText}</TableCell>
                <TableCell>
                  <Button onClick={() => handleConfirmEmergency(emergency.Name)}>Confirm</Button>
                  <Button onClick={() => handleDeleteEmergency(emergency.Name)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={emergencies.length}
        page={emergencyPage}
        onPageChange={handleEmergencyPageChange}
        rowsPerPage={emergencyRowsPerPage}
        onRowsPerPageChange={handleEmergencyRowsPerPageChange}
        ActionsComponent={CustomPaginationActions}
      />
    </Box>
  );
};

export default AdminPage;
