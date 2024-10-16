import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, Badge, Menu, MenuItem, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ReportIcon from '@mui/icons-material/Report';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const isFullScreen = useMediaQuery('(max-width:600px)');
  const { isAuthenticated, logout } = useAuth();


  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const handleLogout = () => {
    logout();
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const handleClearNotifications = () => {
    setNotifications([]); // Clear all notifications when needed
    handleNotificationClose();
  };

  return (
    <React.Fragment>
      <AppBar position="static">
        <Toolbar>
          {!openDrawer && (
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={handleDrawerOpen}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Report Application
          </Typography>
          {!isFullScreen && (
            <>
              <Button color="inherit" component={Link} to="/">
                <HomeIcon sx={{ mr: 1 }} />
                Home
              </Button>
              <Button color="inherit" component={Link} to="/ComplaintReport">
                <ReportIcon sx={{ mr: 1 }} />
                Complaint Report
              </Button>
              <Button color="inherit" component={Link} to="/EmergencyReport">
                <ReportIcon sx={{ mr: 1 }} />
                Emergency Report
              </Button>
              <IconButton color="inherit" onClick={handleNotificationClick}>
                <Badge badgeContent={notifications.length} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleNotificationClose}
              >
                {notifications.length === 0 ? (
                  <MenuItem>No new notifications</MenuItem>
                ) : (
                  notifications.map((notification) => (
                    <MenuItem key={notification.id}>{notification.message}</MenuItem>
                  ))
                )}
                <MenuItem onClick={handleClearNotifications}>Clear all</MenuItem>
              </Menu>
              {isAuthenticated && (
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={handleDrawerClose}
      >
        <List>
          <ListItem button component={Link} to="/" onClick={handleDrawerClose}>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button component={Link} to="/ComplaintReport" onClick={handleDrawerClose}>
            <ListItemText primary="Complaint Report" />
          </ListItem>
          <ListItem button component={Link} to="/EmergencyReport" onClick={handleDrawerClose}>
            <ListItemText primary="Emergency Report" />
          </ListItem>
          {isAuthenticated && (
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          )}
        </List>
      </Drawer>
    </React.Fragment>
  );
}

export default Navbar;
