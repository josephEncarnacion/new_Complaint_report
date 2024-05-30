import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix marker icon issue with React-Leaflet and Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-shadow.png',
});

const AdminMap = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/complaints');
        const complaints = await response.json();
        const emergencyResponse = await fetch('/emergencies');
        const emergencies = await emergencyResponse.json();
        setData([...complaints, ...emergencies]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '600px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {!loading &&
        data.map((item, index) => {
          const [lat, lon] = item.Location.split(',').map(Number);
          return (
            <Marker key={index} position={[lat, lon]}>
              <Popup>
                <div>
                  <strong>{item.Name}</strong><br />
                  {item.Address}<br />
                  {item.ComplaintType || item.EmergencyType}<br />
                  {item.ComplaintText || item.EmergencyText}
                </div>
              </Popup>
            </Marker>
          );
        })}
    </MapContainer>
  );
};

export default AdminMap;
