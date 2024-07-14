import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React, { useState } from 'react';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import CreateOptions from './modals/CreateOptions';
import ViewOptions from './modals/ViewOptions';
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import ReportGmailerrorredSharpIcon from '@mui/icons-material/ReportGmailerrorredSharp';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import MenuIcon from '@mui/icons-material/Menu';
import {useNavigate, useLocation} from "react-router-dom" 
import HomeIcon from '@mui/icons-material/Home';
const drawerWidth = 70;

function AppNavigation(props) {

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const location = useLocation();
  
  const [width, setWidth] = useState(drawerWidth);

  const NAVS = Object.freeze({
    CREATE: 0,
    VIEW: 1,
  });
  const [currentNavigation, setCurrentNavigation] = useState(null);


  React.useEffect(() => {
    console.log("WHATT");
  }, [location]);

  // Navigation
  const navigate = useNavigate();

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const openCreate = () => {
    setCurrentNavigation(NAVS.CREATE)

    const newWidth = drawerWidth + 210
    setWidth(newWidth)
  };

  const drawer = (
    <div>
      <div className='left_half'>
        <List width={drawerWidth} sx={{ bgcolor: 'background.paper' }}>
          <ListItem key={"text1"} disablePadding>
            <IconButton size="large" color="info" onClick={() => openCreate()}>
              <MenuIcon className={`medium_button `} />
            </IconButton>
          </ListItem>
          <ListItem key={"text1"} disablePadding>
            <IconButton size="large" color="primary" onClick ={()=>{ navigate("/")}}>
              <HomeIcon className={`medium_button `} />
            </IconButton>
          </ListItem>
          <ListItem margin="normal"
            sx={{
              width: "75%"
            }}
            key={"text1"} disablePadding>
            <IconButton size="large" color="secondary" onClick={() => openCreate()}>
              <AddSharpIcon className={`medium_button `} />
            </IconButton>
          </ListItem>
          <ListItem key={"text2"} disablePadding>
            <IconButton size="large" color="view" onClick={() => openCreate()}>
              <VisibilitySharpIcon className={`medium_button `} />
            </IconButton>
          </ListItem>
          <ListItem key={"text3"} disablePadding>
            <IconButton size="large" color="error" onClick={() => {navigate("/alerts")}}>
              <ReportGmailerrorredSharpIcon className={`medium_button `} />
            </IconButton>
          </ListItem>
          <ListItem key={"text3"} disablePadding>
            <IconButton size="large" color="lime" onClick={() => {navigate("/todos")}}>
              <FormatListNumberedIcon className={`medium_button `} />
            </IconButton>
          </ListItem>
        </List>
      </div>
      <div className='right_three_qaurter'>
        {currentNavigation === NAVS.CREATE && (
          <CreateOptions
            width={200}
            onClose={() => setCurrentNavigation(null)}
          />
        )}
        {currentNavigation === NAVS.VIEW && (
          <ViewOptions
            width={200}
            onClose={() => setCurrentNavigation(null)}
          />
        )}
      </div>
    </div>
  );

  // Remove this const when copying and pasting into your project.
  const container = window ? () => window().document.body : null;

  return (
    <Box
      component="nav"
      sx={{ width: { sm: width }, flexShrink: { sm: 0 }}}
      aria-label="mailbox folders"
      backgroundColor='secondary'
      
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: width },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: width },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

export default AppNavigation;
