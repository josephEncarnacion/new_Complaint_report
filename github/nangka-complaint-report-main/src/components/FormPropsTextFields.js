import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';

// Import the InputFileUpload component here
import InputFileUpload from './InputFileUpload';

const ComplaintForm = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [complaintType, setComplaintType] = useState('');
  const [complaintText, setComplaintText] = useState('');

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

  const handleSubmit = async () => {
    try {
      const ipResponse = await fetch('/geoip');
    const ipData = await ipResponse.json();
    const formData = {
        name,
        address,
        complaintType,
        complaintText,
        location: ipData.loc // Add location from IP geolocation data

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
        // Optionally, handle success or failure based on the response
    } catch (error) {
        console.error('Error submitting complaint:', error);
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
          fullWidth
          value={address}
          onChange={handleAddressChange}
          margin="normal"
        />
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
        {/* Add the InputFileUpload component here */}
        <InputFileUpload />
        <Box marginTop={2}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit Complaint
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ComplaintForm;
