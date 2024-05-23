import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ReportIcon from '@mui/icons-material/Report';
import { Link } from 'react-router-dom';

function Navbar() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const isFullScreen = useMediaQuery('(max-width:600px)');

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
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
        </List>
      </Drawer>
    </React.Fragment>
  );
}

export default Navbar;
