const express = require('express');
const dbOperation = require('./dbfiles/dbOperation');
const cors = require('cors');
const { getPaginatedComplaints, getPaginatedEmergencies } = require('./dbfiles/dbOperation');
const API_PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Use extended to parse nested objects
app.use(cors());

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
      const emergencies = await getPaginatedEmergencies(parseInt(page), parseInt(pageSize));
      res.json(emergencies);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch emergencies' });
  }
});

// Route to handle form submission
app.post('/submitComplaint', async (req, res) => {
    const { name, address, complaintType, complaintText } = req.body;
    try {
        // Insert form data into the database
        await dbOperation.insertComplaint(name, address, complaintType, complaintText);
        res.status(200).json({ success: true, message: 'Complaint submitted successfully.' });
    } catch (error) {
        console.error('Error submitting complaint:', error);
        res.status(500).json({ success: false, message: 'Failed to submit complaint.' });
    }
});

app.post('/submitEmergencyReport', async (req, res) => {
    const { name, address, emergencyType, emergencyText } = req.body;
    try {
        // Insert emergency report data into the database
        await dbOperation.insertEmergencyReport(name, address, emergencyType, emergencyText);
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
            res.status(200).json({ success: true, message: 'Login successful.' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ success: false, message: 'Error logging in.' });
    }
});

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

  app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
      // Check if the user already exists
      const existingUser = await dbOperation.getUserByUsername(username);
      if (existingUser) {
        res.status(400).json({ success: false, message: 'Username already exists.' });
      } else {
        // Insert the new user into the database
        await dbOperation.insertUser({ username, email, password });
        res.status(200).json({ success: true, message: 'Registration successful.' });
      }
    } catch (error) {
      console.error('Error registering:', error);
      res.status(500).json({ success: false, message: 'Error registering.' });
    }
  });
  app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;
    // Verify the registration data and create a new user
    res.json({ success: true });
  });

app.listen(API_PORT, () => console.log(`Server is running on port ${API_PORT}`));
