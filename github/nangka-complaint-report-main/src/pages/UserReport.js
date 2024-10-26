// src/pages/UserReport.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  Grid,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import Navbar from '../components/Navbar';
import EmergencyForm from '../components/EmergencyForm';
import ComplaintForm from '../components/FormPropsTextFields';
import ReportIcon from '@mui/icons-material/Report';
import WarningIcon from '@mui/icons-material/Warning';
import PhoneIcon from '@mui/icons-material/Phone';

const UserReport = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const reportType = searchParams.get('type');
  const theme = useTheme();

  return (
    <Box>
      <Navbar />
      <Box sx={{ mt: 3, p: 4 }}>
        {reportType === 'complaint' ? (
          <ComplaintForm />
        ) : reportType === 'emergency' ? (
          <EmergencyForm />
        ) : (
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={8} textAlign="center">
              <Typography variant="h4" gutterBottom>
                Welcome to Barangay Report and Complaint System
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
                Your voice matters. This system helps you easily submit reports and complaints, making our barangay safer
                and more responsive to your needs.
              </Typography>
            </Grid>

            <Grid item xs={12} md={8}>
              <Typography variant="h5" gutterBottom>
                Types of Reports You Can Submit
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <ListItem>
                        <IconButton edge="start" aria-label="complaint">
                          <ReportIcon />
                        </IconButton>
                        <ListItemText
                          primary="Complaint Reports"
                          secondary="Report issues related to community services, neighborhood disputes, or concerns within the barangay."
                        />
                      </ListItem>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <ListItem>
                        <IconButton edge="start" aria-label="emergency">
                          <WarningIcon />
                        </IconButton>
                        <ListItemText
                          primary="Emergency Reports"
                          secondary="Notify officials of urgent issues such as accidents, health emergencies, or threats to public safety."
                        />
                      </ListItem>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={8} textAlign="center">
              <Typography variant="h5" gutterBottom>
                Get Involved
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Help us improve our barangay by actively participating in community matters. Stay informed about the
                latest updates and announcements through this platform.
              </Typography>
            </Grid>
          </Grid>
        )}
      </Box>

      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          p: 3,
          mt: 4,
          borderTop: '1px solid',
          borderColor: theme.palette.divider,
          bottom: 0,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Important Contacts
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          If you need immediate assistance, please contact:
        </Typography>
        <List>
          <ListItem>
            <IconButton edge="start" aria-label="hotline">
              <PhoneIcon />
            </IconButton>
            <ListItemText primary="Barangay Hotline" secondary="(+63) 123-4567" />
          </ListItem>
          <Divider />
          <ListItem>
            <IconButton edge="start" aria-label="police">
              <PhoneIcon />
            </IconButton>
            <ListItemText primary="Police Station" secondary="(+63) 890-1234" />
          </ListItem>
          <Divider />
          <ListItem>
            <IconButton edge="start" aria-label="health-center">
              <PhoneIcon />
            </IconButton>
            <ListItemText primary="Health Center" secondary="(+63) 567-8901" />
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default UserReport;
