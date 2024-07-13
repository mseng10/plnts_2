import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React from 'react';
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
import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import {useNavigate, useLocation} from "react-router-dom" 

const drawerWidth = 64;

function AppNavigation(props) {

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const location = useLocation();

  React.useEffect(() => {
    console.log("WHATT");
  }, [location]);

  // Navigation
  const navigate = useNavigate();

  // Button Display
  const [isCreateButtonsOpen, setIsCreateButtonsOpen] = React.useState(false);
  const [isViewButtonsOpen, setIsViewButtonsOpen] = React.useState(false);

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const drawer = (
    <div>
      <List sx={{ bgcolor: 'background.paper' }}>
        <ListItem key={"text1"} disablePadding>
          <IconButton size="large" color="info" onClick={() => setIsCreateButtonsOpen(true)}>
            <MenuIcon className={`medium_button `} />
          </IconButton>
        </ListItem>
        <ListItem key={"text1"} disablePadding>
          <IconButton size="large" color="primary" onClick ={()=>{ navigate("/")}}>
            <GrassOutlinedIcon className={`medium_button `} />
          </IconButton>
        </ListItem>
        <ListItem key={"text1"} disablePadding>
          <IconButton size="large" color="secondary" onClick={() => setIsCreateButtonsOpen(true)}>
            <AddSharpIcon className={`medium_button `} />
          </IconButton>
        </ListItem>
        <ListItem key={"text2"} disablePadding>
          <IconButton size="large" color="info" onClick={() => setIsViewButtonsOpen(true)}>
            <VisibilitySharpIcon className={`medium_button `} />
          </IconButton>
        </ListItem>
        <ListItem key={"text3"} disablePadding>
          <IconButton size="large" color="error" onClick={() => navigate("/alerts")}>
            <ReportGmailerrorredSharpIcon className={`medium_button `} />
          </IconButton>
        </ListItem>
      </List>
    </div>
  );

  // Remove this const when copying and pasting into your project.
  const container = window ? () => window().document.body : null;

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 }}}
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
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
      {isCreateButtonsOpen && (
        <CreateOptions
          isOpen={isCreateButtonsOpen}
          onClose={() => setIsCreateButtonsOpen(false)}
        />
      )}
      {isViewButtonsOpen && (
        <ViewOptions
          isOpen={isViewButtonsOpen}
          onClose={() => setIsViewButtonsOpen(false)}
        />
      )}
    </Box>
  );
}

export default AppNavigation;
