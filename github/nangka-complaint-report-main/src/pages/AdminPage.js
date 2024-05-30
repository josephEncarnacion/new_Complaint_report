import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Box, Typography
} from '@mui/material';
import CustomPaginationActions from '../components/CustomPaginationActions'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


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
      <Typography variant="h4" align="center" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="h6">Map</Typography>
      <MapContainer center={[14.6507, 121.1029]} zoom={14} style={{ height: '400px', width: '100%' }}>
      <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {complaints.map((complaint) => {
            const [lat, lon] = complaint.Location.split(','); // Assuming Location is stored as 'lat,lon'
            return (
              <Marker key={complaint.ComplaintID} position={[lat, lon]}>
                <Popup>
                  <strong>{complaint.Name}</strong><br />
                  {complaint.ComplaintType}<br />
                  {complaint.ComplaintText}
                </Popup>
              </Marker>
            );
          })}
          {emergencies.map((emergency) => {
            const [lat, lon] = emergency.Location.split(','); // Assuming Location is stored as 'lat,lon'
            return (
              <Marker key={emergency.EmergencyID} position={[lat, lon]}>
                <Popup>
                  <strong>{emergency.Name}</strong><br />
                  {emergency.EmergencyType}<br />
                  {emergency.EmergencyText}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      <Box mt={4}>
        <Typography variant="h6">Complaints</Typography>
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Complaint Type</TableCell>
                <TableCell>Complaint Text</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {complaints.map((complaint) => (
                <TableRow key={complaint.ComplaintID}>
                  <TableCell>{complaint.Name}</TableCell>
                  <TableCell>{complaint.Address}</TableCell>
                  <TableCell>{complaint.ComplaintType}</TableCell>
                  <TableCell>{complaint.ComplaintText}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: 2 }}>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={-1}  // Server-side pagination, so -1 to hide the total count
              rowsPerPage={complaintRowsPerPage}
              page={complaintPage}
              onPageChange={handleComplaintPageChange}
              onRowsPerPageChange={handleComplaintRowsPerPageChange}
              ActionsComponent={(subProps) => (
                <CustomPaginationActions {...subProps} count={complaints.length} />
              )}
            />
          </Box>
        </TableContainer>
      </Box>
      <Box mt={4}>
        <Typography variant="h6">Emergencies</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Emergency Type</TableCell>
                <TableCell>Emergency Text</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {emergencies.map((emergency) => (
                <TableRow key={emergency.EmergencyID}>
                  <TableCell>{emergency.Name}</TableCell>
                  <TableCell>{emergency.Address}</TableCell>
                  <TableCell>{emergency.EmergencyType}</TableCell>
                  <TableCell>{emergency.EmergencyText}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: 2 }}>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={-1}  // Server-side pagination, so -1 to hide the total count
              rowsPerPage={emergencyRowsPerPage}
              page={emergencyPage}
              onPageChange={handleEmergencyPageChange}
              onRowsPerPageChange={handleEmergencyRowsPerPageChange}
              ActionsComponent={(subProps) => (
                <CustomPaginationActions {...subProps} count={emergencies.length} />
              )}
            />
          </Box>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default AdminPage;
