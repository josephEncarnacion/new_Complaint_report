// src/pages/Register.js
import React, { useState } from 'react';
import { Grid, TextField, Button, Typography, Paper, Box, Checkbox, FormControlLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Link } from 'react-router-dom';
import { validateEmail, validatePassword } from '../utils/validation'; // Ensure validation.js exists

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [openTerms, setOpenTerms] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Input validation
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the terms and conditions.');
      return;
    }

    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (data.success) {
        window.location.href = '/login';
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error registering:', error);
      setError('An error occurred during registration. Please try again later.');
    }
  };

  const handleOpenTerms = () => {
    setOpenTerms(true);
  };

  const handleCloseTerms = () => {
    setOpenTerms(false);
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12} sm={8} md={4}>
        <Paper elevation={6} style={{ padding: '2em' }}>
          <Box textAlign="center" marginBottom="1em">
            <Typography variant="h4">Register</Typography>
          </Box>
          {error && (
            <Typography color="error" variant="body2" align="center" gutterBottom>
              {error}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox checked={agreeTerms} onChange={(event) => setAgreeTerms(event.target.checked)} />}
                  label={
                    <Typography variant="body2">
                      I agree to the{' '}
                      <Button variant="text" color="primary" onClick={handleOpenTerms}>
                        terms and conditions
                      </Button>
                      .
                    </Typography>
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" type="submit" fullWidth>
                  Register
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" align="center">
                  Already have an account?{' '}
                  <Link to="/login">Login here</Link>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>

      {/* Terms and Conditions Modal */}
      <Dialog open={openTerms} onClose={handleCloseTerms} maxWidth="md" fullWidth>
        <DialogTitle>Terms and Conditions</DialogTitle>
        <DialogContent>
          <DialogContentText component="div" style={{ whiteSpace: 'pre-line', marginTop: '1em' }}>
            <Typography variant="h6" gutterBottom>Last Updated: [Insert Date]</Typography>
            
            <Typography variant="body1" paragraph>
              Welcome to [Your Company Name]! Before you proceed with registering for an account, please carefully read these Terms and Conditions. By creating an account, you agree to be bound by the following terms:
            </Typography>

            <Typography variant="subtitle1" gutterBottom>1. Data Collection</Typography>
            <Typography variant="body2" paragraph>
              We collect personal information including but not limited to your name, email address, phone number, and geographic location.
              The information you provide will be used to create and manage your account, enhance your experience on our platform, and for other purposes as described in our Privacy Policy.
            </Typography>

            <Typography variant="subtitle1" gutterBottom>2. Data Usage</Typography>
            <Typography variant="body2" paragraph>
              Your personal data may be used to:
              {'\n'}- Verify your identity.
              {'\n'}- Provide customer support.
              {'\n'}- Improve our services and develop new features.
              {'\n'}- Send promotional materials, with your consent.
            </Typography>

            <Typography variant="subtitle1" gutterBottom>3. Data Protection</Typography>
            <Typography variant="body2" paragraph>
              We are committed to protecting your personal data. All personal information is stored securely and access is restricted to authorized personnel only.
              We implement industry-standard security measures, including encryption and secure communication channels, to protect your data from unauthorized access.
            </Typography>

            <Typography variant="subtitle1" gutterBottom>4. User Responsibilities</Typography>
            <Typography variant="body2" paragraph>
              You agree to provide accurate and complete information during the registration process.
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </Typography>

            <Typography variant="subtitle1" gutterBottom>5. Consent to Communication</Typography>
            <Typography variant="body2" paragraph>
              By registering, you consent to receive communications from us related to your account and our services. You may opt out of non-essential communications at any time.
            </Typography>

            <Typography variant="subtitle1" gutterBottom>6. Third-Party Services</Typography>
            <Typography variant="body2" paragraph>
              We may share your personal data with third-party service providers who assist us in delivering our services. These providers are obligated to protect your data in accordance with our standards.
            </Typography>

            <Typography variant="subtitle1" gutterBottom>7. Changes to Terms</Typography>
            <Typography variant="body2" paragraph>
              We reserve the right to update these Terms and Conditions at any time. If we make significant changes, we will notify you via email or through our platform.
            </Typography>

            <Typography variant="subtitle1" gutterBottom>8. Governing Law</Typography>
            <Typography variant="body2" paragraph>
              These Terms and Conditions are governed by and construed in accordance with the laws of [Your Jurisdiction]. Any disputes arising from these terms will be subject to the exclusive jurisdiction of the courts in [Your Jurisdiction].
            </Typography>

            <Typography variant="subtitle1" gutterBottom>9. Contact Information</Typography>
            <Typography variant="body2" paragraph>
              If you have any questions or concerns about these Terms and Conditions, please contact us at [Your Contact Information].
            </Typography>

            <Typography variant="body1" paragraph>
              By checking the box and clicking "Register," you acknowledge that you have read, understood, and agree to these Terms and Conditions, and consent to the collection and use of your personal data as described herein.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTerms} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default Register;
