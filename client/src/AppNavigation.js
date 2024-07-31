import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import IconFactory from './elements/IconFactory';

const drawerWidth = 70;
const expandedDrawerWidth = 280;

const navigationOptions = [
  { id: 'menu', url: '/', icon: 'menu', color: 'info' },
  { id: 'home', url: '/', icon: 'home', color: 'primary' },
  { id: 'create', icon: 'create', color: 'primary', subMenu: [
    { id: 'plant', url: '/plant/create', icon: 'plant', label: 'Plant' },
    { id: 'type', url: '/type/create', icon: 'type', label: 'Type' },
    { id: 'genus', url: '/genus/create', icon: 'genus', label: 'Genus' },
    { id: 'system', url: '/system/create', icon: 'system', label: 'System' },
    { id: 'light', url: '/light/create', icon: 'light', label: 'Light' },
    { id: 'todo', url: '/todo/create', icon: 'todo', label: 'Todo' },
  ]},
  { id: 'view', icon: 'view', color: 'primary', subMenu: [
    { id: 'plant', url: '/plant', icon: 'plant', label: 'Plant' },
    { id: 'system', url: '/system', icon: 'system', label: 'System' },
  ]},
  { id: 'alert', url: '/alerts', icon: 'alert', color: 'primary' },
  { id: 'todo', url: '/todo', icon: 'todo', color: 'primary' },
];

function AppNavigation({ window }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedSubOption, setSelectedSubOption] = useState(null);

  useEffect(() => {
    const currentPath = location.pathname;
    const currentOption = navigationOptions.find(option => 
      option.url === currentPath || (option.subMenu && option.subMenu.some(subOption => subOption.url === currentPath))
    );
    
    if (currentOption) {
      setSelectedOption(currentOption.id);
      if (currentOption.subMenu) {
        const currentSubOption = currentOption.subMenu.find(subOption => subOption.url === currentPath);
        setSelectedSubOption(currentSubOption ? currentSubOption.id : null);
      }
    }
  }, [location]);

  const handleNavigation = (option) => {
    if (option.subMenu) {
      setDrawerOpen(true);
      setSelectedOption(option.id);
    } else {
      navigate(option.url);
      setDrawerOpen(false);
      setSelectedOption(option.id);
      setSelectedSubOption(null);
    }
  };

  const handleSubNavigation = (subOption) => {
    navigate(subOption.url);
    setSelectedSubOption(subOption.id);
    setDrawerOpen(false);
  };

  const drawer = (
    <div>
      <div className='left_half'>
        <List>
          {navigationOptions.map((option) => (
            <ListItem key={option.id} disablePadding>
              <IconButton
                size="large"
                color={option.color}
                onClick={() => handleNavigation(option)}
              >
                <IconFactory
                  icon={option.icon}
                  color={option.color}
                  size="md"
                />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </div>
      <div className='right_three_qaurter'>
        {drawerOpen && selectedOption && (
          <List>
            {navigationOptions.find(option => option.id === selectedOption)?.subMenu?.map((subOption) => (
              <ListItem key={subOption.id}>
                <ListItemButton
                  selected={selectedSubOption === subOption.id}
                  onClick={() => handleSubNavigation(subOption)}
                >
                  <ListItemIcon>
                    <IconFactory
                      icon={subOption.icon}
                      color="primary"
                    />
                  </ListItemIcon>
                  <ListItemText primary={subOption.label} style={{ color: "#ffffff" }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </div>
    </div>
  );

  const container = window ? () => window().document.body : null;

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: drawerOpen ? expandedDrawerWidth : drawerWidth },
        flexShrink: { sm: 0 },
      }}
      aria-label="navigation drawer"
    >
      <Drawer
        container={container}
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerOpen ? expandedDrawerWidth : drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerOpen ? expandedDrawerWidth : drawerWidth,
            transition: 'width 0.3s ease-in-out',
            background: 'inherit'
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

export default AppNavigation;