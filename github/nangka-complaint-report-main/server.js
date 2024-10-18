const express = require('express');
const dbOperation = require('./dbfiles/dbOperation');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');  // Move path import to the top


const API_PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',  // Allow all origins (you can restrict this for security)
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Use extended to parse nested objects
app.use(cors());

const { getConfirmedComplaints, getConfirmedEmergencies } = require('./dbfiles/dbOperation');
const { getPaginatedComplaints, getPaginatedEmergencies } = require('./dbfiles/dbOperation');


let responseTeamPosition = {
  latitude: 51.505,  // Initial value
  longitude: -0.09,  // Initial value
};

// WebSocket connection handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send the current position to the connected client
  socket.emit('positionUpdate', responseTeamPosition);
  console.log('positionUpdate' + responseTeamPosition);

  // Listen for position updates from the client
  socket.on('sendPosition', (newPosition) => {
    responseTeamPosition = newPosition;  // Update server-side position
    io.emit('positionUpdate', responseTeamPosition);  // Broadcast updated position to all clients
    console.log('Broadcasting updated position:', responseTeamPosition);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.get('/api/confirmedReports', async (req, res) => {
    try {
        const confirmedComplaints = await getConfirmedComplaints();
        const confirmedEmergencies = await getConfirmedEmergencies();
        res.json({
            complaints: confirmedComplaints,
            emergencies: confirmedEmergencies
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch confirmed reports' });
    }
});



app.get('/api', (req, res) => {
  res.json({ message: 'API endpoint is working' });
});
app.get('/complaints', async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  try {
      const complaints = await getPaginatedComplaints(parseInt(page), parseInt(pageSize));
      res.json(complaints);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

app.get('/emergencies', async (req, res) => {
    const { page = 1, pageSize = 10 } = req.query;
    try {
        const emergencies = await dbOperation.getPaginatedEmergencies(parseInt(page), parseInt(pageSize));
        res.json(emergencies); // Make sure mediaUrl is included in the response
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch emergencies' });
    }
  });
  

// Route to handle form submission
app.post('/submitComplaint', async (req, res) => {
    const { name, address, complaintType, complaintText,location, mediaUrl } = req.body;
    const { lat, lng } = location; // Extract latitude and longitude from location object
    try {
      await dbOperation.insertComplaint(name, address, complaintType, complaintText , lat, lng, mediaUrl);
      res.status(200).json({ success: true, message: 'Complaint report submitted successfully.' });
  } catch (error) {
      console.error('Error submitting Complaint report:', error);
      res.status(500).json({ success: false, message: 'Failed to submit Complaint report.' });
  }
});
app.post('/submitEmergencyReport', async (req, res) => {
    const { name, address, emergencyType, emergencyText, location, mediaUrl } = req.body; // Add mediaUrl
    const { lat, lng } = location;
    try {
        await dbOperation.insertEmergencyReport(name, address, emergencyType, emergencyText, lat, lng, mediaUrl); // Include mediaUrl
        res.status(200).json({ success: true, message: 'Emergency report submitted successfully.' });
    } catch (error) {
        console.error('Error submitting emergency report:', error);
        res.status(500).json({ success: false, message: 'Failed to submit emergency report.' });
    }
  });
  
  

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.js');
  });
  
  app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.js');
  });
  
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await dbOperation.getUserByUsername(username);
        if (user && user.password === password) {
            res.status(200).json({ success: true, role: user.role, message: 'Login successful.' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ success: false, message: 'Error logging in.' });
    }
});


app.post('/register', async (req, res) => {
  const { username, firstName, lastName, password } = req.body;
  try {
      const existingUser = await dbOperation.getUserByUsername(username);
      if (existingUser) {
          return res.status(400).json({ success: false, message: 'Username already exists.' });
      }
      await dbOperation.insertUser({ username, firstName, lastName, password });
      res.status(200).json({ success: true, message: 'Registration successful.' });
  } catch (error) {
      console.error('Error registering:', error);
      res.status(500).json({ success: false, message: 'Error registering.' });
  }
});


  // Delete complaint by name
app.delete('/complaints/:name', async (req, res) => {
  const { name } = req.params;
  try {
      await dbOperation.deleteComplaintByName(name);
      res.status(200).json({ success: true, message: 'Complaint deleted successfully.' });
  } catch (error) {
      console.error('Error deleting complaint:', error);
      res.status(500).json({ success: false, message: 'Failed to delete complaint.' });
  }
});

// Delete emergency by name
app.delete('/emergencies/:name', async (req, res) => {
  const { name } = req.params;
  try {
      await dbOperation.deleteEmergencyByName(name);
      res.status(200).json({ success: true, message: 'Emergency deleted successfully.' });
  } catch (error) {
      console.error('Error deleting emergency:', error);
      res.status(500).json({ success: false, message: 'Failed to delete emergency.' });
  }
});
app.post('/complaints/confirm/:name', async (req, res) => {
  const { name } = req.params;
  try {
      await dbOperation.confirmComplaintByName(name);
      res.status(200).json({ success: true, message: 'Complaint confirmed successfully.' });
  } catch (error) {
      console.error('Error confirming complaint:', error);
      res.status(500).json({ success: false, message: 'Failed to confirm complaint.' });
  }
});

app.post('/emergencies/confirm/:name', async (req, res) => {
  const { name } = req.params; 
  try {
      await dbOperation.confirmEmergencyByName(name);   
      res.status(200).json({ success: true, message: 'Emergency confirmed successfully.' });
  } catch (error) {
      console.error('Error confirming emergency:', error);
      res.status(500).json({ success: false, message: 'Failed to confirm emergency.' });
  }
});
  
app.listen(API_PORT, () => console.log(`Server is running on port ${API_PORT}`));
