import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import InputFileUpload from './InputFileUpload';

const EmergencyForm = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyType, setEmergencyType] = useState('');
  const [emergencyText, setEmergencyText] = useState('');

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

  const handleSubmit = async () => {
    const formData = {
        name,
        address,
        emergencyType,
        emergencyText,
    };

    try {
        const response = await fetch('/submitEmergencyReport', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        console.log('Response from server:', data);
        // Optionally, handle success or failure based on the response
    } catch (error) {
        console.error('Error submitting emergency report:', error);
        // Handle error
    }
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
            <MenuItem value="medical emergencies">medical emergencies</MenuItem>
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
        {/* Add the InputFileUpload component here */}
        <InputFileUpload />
        <Box marginTop={2}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit Report
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EmergencyForm;
