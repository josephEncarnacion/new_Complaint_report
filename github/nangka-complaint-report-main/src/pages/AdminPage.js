import React, { useEffect, useState, useCallback } from 'react';
import {
  Button, TablePagination, TableContainer, TableHead, AppBar, Toolbar, IconButton, Typography, Box, Drawer,
  List, ListItem, ListItemIcon, ListItemText, CssBaseline, Container, Table, TableBody, TableCell,
  TableRow, Paper,
} from '@mui/material';
import { Menu as MenuIcon, Dashboard as DashboardIcon, Map as MapIcon,Report as ReportIcon, Support as SupportIcon} from '@mui/icons-material';
import CustomPaginationActions from '../components/CustomPaginationActions';
import MapComponent from '../components/MapComponent';
import { useAuth } from '../contexts/AuthContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';

const defaultMarkerIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const vehicleIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="border-radius: 50%; width: 32px; height: 32px; display: flex; justify-content: center; align-items: center;">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H16V4C16 2.9 15.1 2 14 2H10C8.9 2 8 2.9 8 4V5H6.5C5.84 5 5.28 5.42 5.08 6.01L3 12V21C3 21.55 3.45 22 4 22H5C5.55 22 6 21.55 6 21V20H18V21C18 21.55 18.45 22 19 22H20C20.55 22 21 21.55 21 21V12L18.92 6.01ZM10 4H14V5H10V4ZM6.85 7H17.14L18.22 10H5.78L6.85 7ZM19 18C18.45 18 18 17.55 18 17C18 16.45 18.45 16 19 16C19.55 16 20 16.45 20 17C20 17.55 19.55 18 19 18ZM5 18C4.45 18 4 17.55 4 17C4 16.45 4.45 16 5 16C5.55 16 6 16.45 6 17C6 17.55 5.55 18 5 18ZM5 14V12H19V14H5Z" fill="black"/>
           </svg>
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const POLLING_INTERVAL = 10000;
const drawerWidth = 240;

const AdminPage = () => {
  const { logout } = useAuth();
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [complaints, setComplaints] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [complaintPage, setComplaintPage] = useState(0);
  const [complaintRowsPerPage, setComplaintRowsPerPage] = useState(10);
  const [emergencyPage, setEmergencyPage] = useState(0);
  const [emergencyRowsPerPage, setEmergencyRowsPerPage] = useState(10);
  const [responseTeamLocations, setResponseTeamLocations] = useState([]);
  const [confirmedReports, setConfirmedReports] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const [locationsRes, reportsRes] = await Promise.all([
        axios.get('/api/responseTeamLocations'),
        axios.get('/api/confirmedReports')
      ]);

      if (locationsRes.data.success) setResponseTeamLocations(locationsRes.data.locations);

      const reportsData = reportsRes.data;
      setComplaints(reportsData.complaints || []);
      setEmergencies(reportsData.emergencies || []);
      setConfirmedReports([...reportsData.complaints, ...reportsData.emergencies]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, POLLING_INTERVAL);
    return () => clearInterval(intervalId);
  }, [fetchData]);

  const fetchPaginatedData = useCallback(
    async (type, page, rowsPerPage) => {
      try {
        const response = await axios.get(`/${type}?page=${page + 1}&pageSize=${rowsPerPage}`);
        const data = response.data;
        type === 'complaints' ? setComplaints(data) : setEmergencies(data);
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
      }
    },
    []
  );

  const handleAction = async (type, name, action) => {
    if (window.confirm(`Are you sure you want to ${action} this ${type}?`)) {
      try {
        const response = await axios({
          url: `/${type}/${action}/${name}`,
          method: action === 'delete' ? 'DELETE' : 'POST'
        });
        const result = response.data;
        if (result.success) {
          type === 'complaints'
            ? fetchPaginatedData('complaints', complaintPage, complaintRowsPerPage)
            : fetchPaginatedData('emergencies', emergencyPage, emergencyRowsPerPage);
        } else {
          alert(`Failed to ${action} ${type}`);
        }
      } catch (error) {
        console.error(`Error in ${action} ${type}:`, error);
      }
    }
  };

  const renderMedia = (url) => {
    return url ? (
      url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') ? (
        <img src={url} alt="Media" style={{ maxWidth: '100px' }} />
      ) : (
        <a href={url} target="_blank" rel="noopener noreferrer">View Media</a>
      )
    ) : (
      'No media attached'
    );
  };
  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };
  const renderSection = () => {
    switch (selectedSection) {
      case 'map':
        return <MapComponent />;
      case 'monitoring':
        return (
          <Container sx={{ mt: 4 }}>
            <h2>Admin Monitoring</h2>
            <MapContainer center={[14.6507, 121.1029]} zoom={13} style={{ height: '600px', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {responseTeamLocations.map((location, index) => (
                <Marker key={index} position={[location.latitude, location.longitude]} icon={vehicleIcon}>
                  <Popup>
                    <strong>Response Team</strong> <br />
                    Last Updated: {new Date(location.timestamp).toLocaleString()}
                  </Popup>
                </Marker>
              ))}
              {confirmedReports.map((report, index) => (
                <Marker key={index} position={[report.Latitude, report.Longitude]} icon={defaultMarkerIcon}>
                  <Popup>
                    <strong>Name:</strong> {report.Name} <br />
                    <strong>Address:</strong> {report.Address} <br />
                    <strong>Report:</strong> {report.EmergencyType || report.ComplaintType} <br />
                    {renderMedia(report.MediaUrl)}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Container>
        );
      case 'complaints':
      case 'emergencies':
        const data = selectedSection === 'complaints' ? complaints : emergencies;
        const page = selectedSection === 'complaints' ? complaintPage : emergencyPage;
        const rowsPerPage = selectedSection === 'complaints' ? complaintRowsPerPage : emergencyRowsPerPage;
        const handlePageChange = selectedSection === 'complaints' ? setComplaintPage : setEmergencyPage;
        const handleRowsPerPageChange = selectedSection === 'complaints' ? setComplaintRowsPerPage : setEmergencyRowsPerPage;

        return (
          <Container sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              {selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)}
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Media</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.Name}>
                      <TableCell>{item.Name}</TableCell>
                      <TableCell>{item.Address}</TableCell>
                      <TableCell>{item.ComplaintType || item.EmergencyType}</TableCell>
                      <TableCell>{item.ComplaintText || item.EmergencyText}</TableCell>
                      <TableCell>{renderMedia(item.MediaUrl)}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleAction(selectedSection, item.Name, 'confirm')} color="primary">Dispatch</Button>
                        <Button onClick={() => handleAction(selectedSection, item.Name, 'delete')} color="secondary">Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={data.length}
              page={page}
              onPageChange={(event, newPage) => handlePageChange(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => handleRowsPerPageChange(parseInt(event.target.value, 10))}
              ActionsComponent={CustomPaginationActions}
            />
          </Container>
        );
      default:
        return <Typography variant="h4" align="center">Welcome to the Dashboard</Typography>;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}><MenuIcon /></IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>Admin Dashboard</Typography>
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }}>
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
        <List>
            <ListItem button onClick={() => handleSectionChange('dashboard')}>
              <ListItemIcon>
              <DashboardIcon/>
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={() => handleSectionChange('map')}>
              <ListItemIcon>
                <MapIcon />
              </ListItemIcon>
              <ListItemText primary="Map" />
            </ListItem>
            <ListItem button onClick={() => handleSectionChange('complaints')}>
              <ListItemIcon>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText primary="Complaints" />
            </ListItem>
            <ListItem button onClick={() => handleSectionChange('emergencies')}>
              <ListItemIcon>
            <ReportIcon/>
              </ListItemIcon>
              <ListItemText primary="Emergencies" />
            </ListItem>
            <ListItem button onClick={() => handleSectionChange('monitoring')}>
              <ListItemIcon>
                <SupportIcon /> {/* New icon for Monitoring */}
              </ListItemIcon>
              <ListItemText primary="Monitoring" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Toolbar />
        {renderSection()}
      </Box>
    </Box>
  );
};

export default AdminPage;
