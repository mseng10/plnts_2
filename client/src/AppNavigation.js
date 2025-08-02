import React, { useState, useEffect, useMemo } from 'react';
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
import Badge from '@mui/material/Badge';
import { useMeta } from './hooks/useMeta';

const drawerWidth = 70;
const expandedDrawerWidth = 280;

function AppNavigation({ window }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedSubOption, setSelectedSubOption] = useState(null);

  const { meta } = useMeta();

  const navigationOptions = useMemo(() => [
    { id: 'menu', url: '/', icon: 'menu', color: 'info' },
    { id: 'home', url: '/', icon: 'home', color: 'primary' },
    { id: 'create', icon: 'create', color: 'primary', subMenu: [
      { id: 'plants', url: '/plants/create', icon: 'plant', label: 'Plant' },
      { id: 'mix', url: '/mixes/create', icon: 'mix', label: 'Mix' },
      // { id: 'type', url: '/types/create', icon: 'type', label: 'Type' },
      // { id: 'genus', url: '/genuses/create', icon: 'genus', label: 'Genus' },
      { id: 'system', url: '/systems/create', icon: 'system', label: 'System' },
      { id: 'light', url: '/lights/create', icon: 'light', label: 'Light' },
      { id: 'todo', url: '/todos/create', icon: 'todo', label: 'Todo' },
      { id: 'care_plan', url: '/care_plans/create', icon: 'care_plan', label: 'Care Plan'}
    ]},
    { id: 'view', icon: 'view', color: 'primary', subMenu: [
      { id: 'plants', url: '/plants', icon: 'plant', label: 'Plant' },
      { id: 'mixes', url: '/mixes', icon: 'mix', label: 'Mix' },
      { id: 'systems', url: '/systems', icon: 'system', label: 'System' },
      { id: 'todos', url: '/todos', icon: 'todo', label: 'Todo' },
      { id: 'care_plan', url: '/care_plans', icon: 'care_plan', label: 'Care Plans'}
    ]},
    { id: 'alert', url: '/alerts', icon: 'alert', color: 'error', badgeCount: meta.alert_count, badgeCountColor: "error" },
    { id: 'calendar', url: '/calendar', icon: 'calendar', color: 'primary', badgeCount: meta.todo_count },
    { id: 'budget', url: '/budget', icon: 'atm', color: 'primary' },
    { id: 'stats', url: '/stats', icon: 'stats', color: 'primary'},
  ], [meta]);

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
  }, [location, navigationOptions]);

  const handleNavigation = (option) => {
    // The 'menu' button toggles the collapsed state of the primary navigation.
    if (option.id === 'menu') {
      const willCollapse = !isNavCollapsed;
      setIsNavCollapsed(willCollapse);
      // If collapsing the nav, also close any open sub-menu drawer.
      if (willCollapse) {
        setDrawerOpen(false);
        setSelectedOption(null);
      }
      return;
    }

    // If another button is clicked while collapsed, expand the nav.
    if (isNavCollapsed) {
      setIsNavCollapsed(false);
    }

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
          {navigationOptions
            .filter(option => !isNavCollapsed || option.id === 'menu')
            .map((option) => (
            <ListItem key={option.id} disablePadding>
              <IconButton
                size="large"
                color={option.color}
                onClick={() => handleNavigation(option)}
              >
                <Badge badgeContent={"badgeCount" in option ? option.badgeCount : null} color={"badgeCountColor" in option ? option.badgeCountColor : "primary"}>
                  <IconFactory
                    icon={option.icon}
                    color={option.color}
                    size="md"
                  />
                </Badge>
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
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerOpen ? expandedDrawerWidth : drawerWidth,
            background: 'inherit', // To maintain transparency
            borderRight: isNavCollapsed ? 'none' : `1px solid rgba(255, 255, 255, 0.12)`
          },
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
            background: 'inherit', // To maintain transparency
            borderRight: isNavCollapsed ? 'none' : `1px solid rgba(255, 255, 255, 0.12)`
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