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
import axios from 'axios';

const ComplaintForm = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [complaintType, setComplaintType] = useState('');
  const [complaintText, setComplaintText] = useState('');
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

  const handleComplaintTypeChange = (event) => {
    setComplaintType(event.target.value);
  };

  const handleComplaintChange = (event) => {
    setComplaintText(event.target.value);
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
        complaintType,
        complaintText,
        location,
      };
      const response = await fetch('/submitComplaint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Response from server:', data);

      // Show success message
      setSnackbarMessage('Complaint submitted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error submitting complaint:', error);

      // Show error message
      setSnackbarMessage('Failed to submit complaint.');
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
          Complaint Form
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
          multiline
          rows={3}    
          fullWidth
          value={address}
          onChange={handleAddressChange}
          margin="normal"
        />
         <Box marginTop={2} marginLeft={42}>
          <Button variant="contained" color="primary" onClick={handleGetLocation}>
            Get Location
          </Button>
          {locationError}
        </Box>
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel id="complaint-type-label">Complaint Type</InputLabel>
          <Select
            labelId="complaint-type-label"
            id="complaint-type"
            value={complaintType}
            onChange={handleComplaintTypeChange}
            label="Complaint Type"
          >
            <MenuItem value="Noise Complaint">Noise Complaint</MenuItem>
            <MenuItem value="Garbage Collection Issue">Garbage Collection Issue</MenuItem>
            <MenuItem value="Street Light Outage">Street Light Outage</MenuItem>
            <MenuItem value="Pet Wastes">Pet Wastes</MenuItem>
            <MenuItem value="Illegal Parking">Illegal Parking</MenuItem>
            <MenuItem value="Traffic Violation">Traffic Violation</MenuItem>
            {/* Add more complaint types as needed */}
          </Select>
        </FormControl>
        <TextField
          label="Enter your complaint"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={complaintText}
          onChange={handleComplaintChange}
          margin="normal"
        />
        <Box marginTop={2}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit Complaint
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

export default ComplaintForm;
