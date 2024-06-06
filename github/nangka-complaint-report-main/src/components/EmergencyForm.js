import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import InputFileUpload from './InputFileUpload';
import axios from 'axios';

const EmergencyForm = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyType, setEmergencyType] = useState('');
  const [emergencyText, setEmergencyText] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [locationError, setLocationError] = useState(null);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleEmergencyTypeChange = (event) => {
    setEmergencyType(event.target.value);
  };

  const handleEmergencyChange = (event) => {
    setEmergencyText(event.target.value);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setLocationError(null);

        console.log(`Obtained coordinates: Latitude = ${latitude}, Longitude = ${longitude}`);

        const apiKey = 'pk.0fa1d8fd6faab9f422d6c5e37c514ce1';
        const url = `https://us1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${latitude}&lon=${longitude}&format=json`;

        try {
          const response = await axios.get(url);
          const data = response.data;
          console.log('Response from LocationIQ API:', data);
          if (data && data.display_name) {
            setAddress(data.display_name);
          } else {
            setAddress('Address not found');
          }
        } catch (error) {
          console.error('Error fetching address:', error);
          setAddress('Error fetching address');
        }
      },
      () => {
        setLocationError('Unable to retrieve your location');
      }
    );
  };

  const handleSubmit = async () => {
    try {
      const formData = {
        name,
        address,
        emergencyType,
        emergencyText,
        location,
      };

      const response = await fetch('/submitEmergencyReport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Response from server:', data);

      setSnackbarMessage('Emergency report submitted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error submitting emergency report:', error);

      setSnackbarMessage('Failed to submit emergency report.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
      }}
    >
      <Box
        sx={{
          maxWidth: 900,
          padding: 2,
          boxShadow: 1,
          borderRadius: 4,
          backgroundColor: 'background.paper',
          textAlign: 'center',
        }}
      >
        <Typography align="center" variant="h5" gutterBottom>
          Emergency Form
        </Typography>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={handleNameChange}
          margin="normal"
        />
        <TextField
          label="Address"
          variant="outlined"
          fullWidth
          value={address}
          onChange={handleAddressChange}
          margin="normal"
        />
         <Box marginTop={2}>
          <Button variant="contained" color="primary" onClick={handleGetLocation}>
            Get Location
          </Button>
          {locationError && (
            <Typography variant="body1" color="error" marginTop={2}>
              {locationError}
            </Typography>
          )}
        </Box>
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel id="complaint-type-label">Emergency Type</InputLabel>
          <Select
            labelId="complaint-type-label"
            id="complaint-type"
            value={emergencyType}
            onChange={handleEmergencyTypeChange}
            label="Complaint Type"
          >
            <MenuItem value="Earthquake">Earthquake</MenuItem>
            <MenuItem value="Fire">Fire</MenuItem>
            <MenuItem value="Flood">Flood</MenuItem>
            <MenuItem value="Medical Emergencies">Medical Emergencies</MenuItem>
            {/* Add more complaint types as needed */}
          </Select>
        </FormControl>
        <TextField
          label="Enter your Emergency"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={emergencyText}
          onChange={handleEmergencyChange}
          margin="normal"
        />
        <InputFileUpload />
       
        <Box marginTop={2}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit Report
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmergencyForm;
