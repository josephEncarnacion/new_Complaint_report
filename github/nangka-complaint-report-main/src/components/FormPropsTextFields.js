import React, { useState, useRef } from 'react';
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
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Firebase Storage
import { storage } from '../pages/firebase';

const ComplaintForm = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [complaintType, setComplaintType] = useState('');
  const [complaintText, setComplaintText] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [location, setLocation] = useState({ lat: 14.6507, lng: 121.1029 }); // Marikina coordinates
  const [locationError, setLocationError] = useState(null);
  const mapRef = useRef();
  const apiKey = 'pk.0fa1d8fd6faab9f422d6c5e37c514ce1'; // Your LocationIQ API key
  const [file, setFile] = useState(null); 
  const [, setFileUrl] = useState(''); 
  const [previewUrl, setPreviewUrl] = useState(''); 
  const [, setFileName] = useState(''); 
  const [, setUploading] = useState(false); 

  // Handle file selection and create a preview URL for images
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : '');

    // Create a local preview URL if it's an image
    if (selectedFile && (selectedFile.type.startsWith('image/'))) {
      const preview = URL.createObjectURL(selectedFile);
      setPreviewUrl(preview); // Set local image preview
    } else {
      setPreviewUrl(''); // Reset if not an image
    }
  };


  // Custom Marker Icon
  const markerIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleAddressChange = async (event) => {
    setAddress(event.target.value);
    if (event.target.value.length > 3) {
      try {
        const response = await axios.get(`https://us1.locationiq.com/v1/autocomplete.php?key=${apiKey}&q=${event.target.value}&format=json`);
        setAddressSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
      }
    } else {
      setAddressSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setAddress(suggestion.display_name);
    setLocation({ lat: suggestion.lat, lng: suggestion.lon });
    setAddressSuggestions([]);
    mapRef.current.flyTo([suggestion.lat, suggestion.lon], 15);
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

        const url = `https://us1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${latitude}&lon=${longitude}&format=json`;

        try {
          const response = await axios.get(url);
          const data = response.data;
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
      if (!file) {
        setSnackbarMessage('Please upload an image or video.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }

      // Upload file to Firebase Storage
      const storageRef = ref(storage, `media/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          setUploading(true);
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          setSnackbarMessage('Error uploading media.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
          setUploading(false);
        },
        async () => {
          const mediaUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setFileUrl(mediaUrl); // Set the uploaded media URL
          setUploading(false);

          // Submit form data with media URL
      const formData = {
        name,
        address,
        complaintType,
        complaintText,
        location,
        mediaUrl, // Include the media URL
      };

      const response = await fetch('/submitComplaint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setSnackbarMessage(data.success ? 'Complaint report submitted successfully!' : 'Failed to submit complaint report.');
      setSnackbarSeverity(data.success ? 'success' : 'error');
      setSnackbarOpen(true);
    }
  );
    } catch (error) {
      console.error('Error submitting complaint:', error);
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
        mt: 4,
        px: { xs: 2, md: 4 },
        maxWidth: '1200px',
        margin: 'auto',
      }}
    >
      <Box
        sx={{
          width: '100%',
          padding: { xs: 2, md: 4 },
          boxShadow: 2,
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
          sx={{ mb: 2 }}
        />
        <TextField
          label="Address"
          variant="outlined"
          fullWidth
          value={address}
          onChange={handleAddressChange}
          margin="normal"
          autoComplete="off"
          sx={{ mb: 2 }}
        />
        {addressSuggestions.length > 0 && (
          <Box
            sx={{
              position: 'absolute',
              zIndex: 1000,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '200px',
              overflowY: 'auto',
            }}
          >
            {addressSuggestions.map((suggestion, index) => (
              <Box
                key={index}
                sx={{
                  padding: 1,
                  cursor: 'pointer',
                  borderBottom: '1px solid #ccc',
                  '&:hover': { backgroundColor: '#f0f0f0' },
                }}
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                {suggestion.display_name}
              </Box>
            ))}
          </Box>
        )}
        <Box marginTop={2} marginBottom={2}>
          <Button variant="contained" color="primary" onClick={handleGetLocation}>
            Get My Location
          </Button>
          {locationError && (
            <Typography variant="body1" color="error" marginTop={2}>
              {locationError}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            height: { xs: '200px', md: '400px' },
            mb: 2,
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <MapContainer
            center={[location.lat, location.lng]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[location.lat, location.lng]} icon={markerIcon} />
          </MapContainer>
        </Box>

        <FormControl fullWidth margin="normal" variant="outlined" sx={{ mb: 2 }}>
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
          </Select>
        </FormControl>
        <TextField
          label="Enter your Complaint"
          variant="outlined"
          fullWidth
          value={complaintText}
          onChange={handleComplaintChange}
          margin="normal"
          multiline
          rows={4}
          sx={{ mb: 2 }}
        />

        
        <div>
          <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
        </div>

        {/* Image Preview Before Submit */}
        {previewUrl && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">Image Preview:</Typography>
            <img src={previewUrl} alt="Selected file preview" style={{ maxWidth: '400px', marginTop: '10px' }} />
          </Box>
        )}

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ComplaintForm;
