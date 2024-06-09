import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { Button, Container } from '@mui/material';
import polyline from '@mapbox/polyline';

// Create a custom icon for the vehicle using LocalTaxiIcon
const vehicleIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color:#ffcc00; border-radius: 50%; width: 32px; height: 32px; display: flex; justify-content: center; align-items: center;">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H16V4C16 2.9 15.1 2 14 2H10C8.9 2 8 2.9 8 4V5H6.5C5.84 5 5.28 5.42 5.08 6.01L3 12V21C3 21.55 3.45 22 4 22H5C5.55 22 6 21.55 6 21V20H18V21C18 21.55 18.45 22 19 22H20C20.55 22 21 21.55 21 21V12L18.92 6.01ZM10 4H14V5H10V4ZM6.85 7H17.14L18.22 10H5.78L6.85 7ZM19 18C18.45 18 18 17.55 18 17C18 16.45 18.45 16 19 16C19.55 16 20 16.45 20 17C20 17.55 19.55 18 19 18ZM5 18C4.45 18 4 17.55 4 17C4 16.45 4.45 16 5 16C5.55 16 6 16.45 6 17C6 17.55 5.55 18 5 18ZM5 14V12H19V14H5Z" fill="black"/>
           </svg>
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const ResponseTeam = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [confirmedReports, setConfirmedReports] = useState([]);
  const [route, setRoute] = useState([]);

  useEffect(() => {
    // Get current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition([latitude, longitude]);
      },
      (error) => {
        console.error(error);
      },
      { enableHighAccuracy: true }
    );

    // Fetch confirmed reports from the API
    const fetchConfirmedReports = async () => {
      try {
        const response = await axios.get('/api/confirmedReports');
        const reports = [
          ...response.data.complaints,
          ...response.data.emergencies
        ];
        setConfirmedReports(reports);
      } catch (error) {
        console.error('Error fetching confirmed reports:', error);
      }
    };

    fetchConfirmedReports();
  }, []);

  const getDirections = async (reportLocation) => {
    if (!currentPosition) return;

    const [currentLat, currentLng] = currentPosition;
    const [reportLat, reportLng] = reportLocation;

    const apiKey = 'pk.0fa1d8fd6faab9f422d6c5e37c514ce1';
    const profile = 'driving';
    const url = `https://us1.locationiq.com/v1/directions/${profile}/${currentLng},${currentLat};${reportLng},${reportLat}?key=${apiKey}&steps=true&alternatives=true&geometries=polyline&overview=full`;

    try {
      const response = await axios.get(url);
      console.log('Full API response:', response.data);

      if (response.data && response.data.routes && response.data.routes.length > 0) {
        const routeData = response.data.routes[0];
        console.log('Route data:', routeData);
        
        if (routeData.geometry) {
          const coordinates = polyline.decode(routeData.geometry);
          const leafletCoordinates = coordinates.map(coord => [coord[0], coord[1]]);
          setRoute(leafletCoordinates);
        } else {
          console.error('Geometry not found in the route data:', routeData);
        }
      } else {
        console.error('No routes found in the API response:', response.data);
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };

  return (
    <Container>
      <h1>Response Team</h1>
      {currentPosition && (
        <MapContainer center={currentPosition} zoom={13} style={{ height: '600px', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={currentPosition} icon={vehicleIcon}>
            <Popup>Your Location</Popup>
          </Marker>
          {confirmedReports.map((report, index) => (
            <Marker key={index} position={[report.Latitude, report.Longitude]}>
              <Popup>
                {report.Name}
                <br />
                <Button variant="contained" onClick={() => getDirections([report.Latitude, report.Longitude])}>
                  Get Directions
                </Button>
              </Popup>
            </Marker>
          ))}
          {route.length > 0 && <Polyline positions={route} color="blue" />}
        </MapContainer>
      )}
    </Container>
  );
};

export default ResponseTeam;
