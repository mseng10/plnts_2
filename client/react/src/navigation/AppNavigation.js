import React, { useState, useEffect } from 'react';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import CreateOptions from './CreateOptions';
import ViewOptions from './ViewOptions';
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import ReportGmailerrorredSharpIcon from '@mui/icons-material/ReportGmailerrorredSharp';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import MenuIcon from '@mui/icons-material/Menu';
import {useNavigate, useLocation} from "react-router-dom" 
import HomeIcon from '@mui/icons-material/Home';

const drawerWidth = 70;
const maxDrawerWidth = drawerWidth + 210

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

  // const NavigationButton  = ({
  //   onClick,
  //   color,
  //   icon
  // }) => {
  
  //   return (
  //     <ListItem disablePadding>
  //       <IconButton size="large" color={color} onClick={() => onClick()}>
  //         {icon}
  //       </IconButton>
  //     </ListItem>
  //   );
  // }


  const escapeListView = (path) => {
    setCurrentNavigation(null);

    const newWidth = drawerWidth;
    setWidth(newWidth);

    if (null != path) {
      navigate(path);
    }
  };

  useEffect(() => {
    // TODO: Turn into factory
    const path = location.pathname;
    console.log(location.pathname);
    if (path == "/" ) {
      // escapeListView(null);
    }
  }, [location, currentNavigation]);

  // Navigation
  const navigate = useNavigate();

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const openCreate = () => {
    setCurrentNavigation(NAVS.CREATE)

    const newWidth = maxDrawerWidth
    setWidth(newWidth)

    navigate("/create");
  };

  const openView = () => {
    setCurrentNavigation(NAVS.VIEW);

    const newWidth = maxDrawerWidth;
    setWidth(newWidth);

    navigate("/view");

  };

  const drawer = (
    <div>
      <div className='left_half'>
        <List width={drawerWidth}>
          <ListItem key={"text1"} disablePadding>
            <IconButton size="large" color="info" onClick={() => openCreate()}>
              <MenuIcon className={`medium_button `} />
            </IconButton>
          </ListItem>
          <ListItem key={"text1"} disablePadding>
            <IconButton size="large" color="primary" onClick ={()=>{ escapeListView("/")}}>
              <HomeIcon className={`medium_button `} />
            </IconButton>
          </ListItem>
          <ListItem key={"text1"} disablePadding>
            <IconButton size="large" color="primary" onClick={() => openCreate()}>
              <AddSharpIcon className={`medium_button `} />
            </IconButton>
          </ListItem>
          <ListItem key={"text2"} disablePadding>
            <IconButton size="large" color="primary" onClick={() => openView()}>
              <VisibilitySharpIcon className={`medium_button `} />
            </IconButton>
          </ListItem>
          <ListItem key={"text3"} disablePadding>
            <IconButton size="large" color="primary" onClick={() => {escapeListView("/alerts")}}>
              <ReportGmailerrorredSharpIcon className={`medium_button `} />
            </IconButton>
          </ListItem>
          <ListItem key={"text3"} disablePadding>
            <IconButton size="large" color="primary" onClick={() => {escapeListView("/todos")}}>
              <FormatListNumberedIcon className={`medium_button`} />
            </IconButton>
          </ListItem>
        </List>
      </div>
      <div className='right_three_qaurter'>
        {currentNavigation === NAVS.CREATE && (
          <CreateOptions
            onClose={() => setCurrentNavigation(null)}
          />
        )}
        {currentNavigation === NAVS.VIEW && (
          <ViewOptions
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
      className='inherit'
      component="nav"
      sx={{ width: { sm: width }, flexShrink: { sm: 0 }}}
      aria-label="mailbox folders"
      backgroundColor='secondary'
      
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        className='inherit'
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
        className='inherit'
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { background: 'inherit', boxSizing: 'border-box', width: width },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

export default AppNavigation;
