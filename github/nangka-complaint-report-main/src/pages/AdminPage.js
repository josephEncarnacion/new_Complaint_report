import React, { useEffect, useState } from 'react';
import {
  Button, TableContainer, TableHead, AppBar, Toolbar, IconButton, Typography, Box, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, Divider, Container, Table, TableBody, TableCell, TableRow, Paper, TablePagination
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MapIcon from '@mui/icons-material/Map';
import ReportIcon from '@mui/icons-material/Report';
import CustomPaginationActions from '../components/CustomPaginationActions';
import MapComponent from '../components/MapComponent';
import { useAuth } from '../contexts/AuthContext'; 

const drawerWidth = 240;

const AdminPage = () => {
  const { logout } = useAuth(); // Access logout function from AuthContext
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [complaints, setComplaints] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [complaintPage, setComplaintPage] = useState(0);
  const [complaintRowsPerPage, setComplaintRowsPerPage] = useState(10);
  const [emergencyPage, setEmergencyPage] = useState(0);
  const [emergencyRowsPerPage, setEmergencyRowsPerPage] = useState(10);
  
  useEffect(() => {
    if (selectedSection === 'complaints') {
      fetchComplaints(complaintPage, complaintRowsPerPage);
    }
  }, [complaintPage, complaintRowsPerPage, selectedSection]);

  useEffect(() => {
    if (selectedSection === 'emergencies') {
      fetchEmergencies(emergencyPage, emergencyRowsPerPage);
    }
  }, [emergencyPage, emergencyRowsPerPage, selectedSection]);

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
        const socket = new WebSocket('ws://localhost:8080');
        socket.onopen = () => {
          socket.send(`Complaint ${name} has been Rejected`);
        };
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
        const socket = new WebSocket('ws://localhost:8080');
        socket.onopen = () => {
          socket.send(`Complaint ${name} has been confirmed`);
        };
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
        const socket = new WebSocket('ws://localhost:8080');
        socket.onopen = () => {
          socket.send(`Emergency Report ${name} has been deleted`);
        };
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
        const socket = new WebSocket('ws://localhost:8080');
        socket.onopen = () => {
          socket.send(`Emergency Report ${name} has been confirmed`);
        };
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

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  const renderSection = () => {
    switch (selectedSection) {
      case 'map':
        return <MapComponent />;
      case 'complaints':
        return (
          <Container sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Complaints
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
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
                        <Button onClick={() => handleConfirmComplaint(complaint.Name)} color="primary">Dispatch</Button>
                        <Button onClick={() => handleDeleteComplaint(complaint.Name)} color="secondary">Delete</Button>
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
          </Container>
        );
      case 'emergencies':
        return (
          <Container sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
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
                    <TableCell>Media</TableCell>
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
                  {emergency.MediaUrl ? (
                    emergency.MediaUrl.endsWith('.jpg') || emergency.MediaUrl.endsWith('.jpeg') || emergency.MediaUrl.endsWith('.png') ? (
                      <img src={emergency.MediaUrl} alt="Emergency Media" style={{ maxWidth: '100px' }} />
                    ) : (
                      <a href={emergency.MediaUrl} target="_blank" rel="noopener noreferrer">View Media Upload</a>
                    )
                  ) : (
                    'No media attached'
                  )}
                </TableCell>
                      <TableCell>
                        <Button onClick={() => handleConfirmEmergency(emergency.Name)} color="primary">Dispatch</Button>
                        <Button onClick={() => handleDeleteEmergency(emergency.Name)} color="secondary">Delete</Button>
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
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem button onClick={() => handleSectionChange('dashboard')}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={() => handleSectionChange('map')}>
              <ListItemIcon>
                <MapIcon />
              </ListItemIcon>
              <ListItemText primary="Map" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => handleSectionChange('complaints')}>
              <ListItemIcon>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText primary="Complaints" />
            </ListItem>
            <ListItem button onClick={() => handleSectionChange('emergencies')}>
              <ListItemIcon>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText primary="Emergencies" />
            </ListItem>
            <ListItem button onClick={() => handleSectionChange('monitoring')}>
              <ListItemIcon>
                <DashboardIcon /> {/* You can use a different icon */}
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
