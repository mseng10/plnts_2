import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import {useNavigate, useLocation} from "react-router-dom" 
import IconFactory from '../elements/IconFactory';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const drawerWidth = 70;
const maxDrawerWidth = drawerWidth + 210

function AppNavigation(props) {

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Navigation
  const navigate = useNavigate();

  // Routing Information
  const location = useLocation();
  
  const [width, setWidth] = useState(drawerWidth);

  const NAVS = Object.freeze({
    NONE: 0,
    CREATE: 1,
    VIEW: 2,
    ALERT: 3,
    TODO: 4,
    HOME: 5
  });
  const [currentNavigation, setCurrentNavigation] = useState(null);


  useEffect(() => {
    // TODO: Turn into factory
    const path = location.pathname;
    console.log(location.pathname);
    if (path == "/" ) {
      // escapeListView(null);
    }
  }, [location, currentNavigation]);

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const changeNav = (options) => {
    if (options.nav) {
      setCurrentNavigation(options.nav)

      const newWidth = maxDrawerWidth
      setWidth(newWidth)
    }
    else {
      setWidth(drawerWidth)
    }

    if (options.url) {
      navigate(options.url);
    }
  };

  const CreateForm = Object.freeze({
    PLANT: 0,
    SYSTEM: 1,
    GENUS: 2,
    LIGHT: 3,
    TYPE: 4,
    TODO: 5
  });

  const ViewForm = Object.freeze({
    PLANT: 0,
    SYSTEM: 1,
  });

  const [selected, setSelected] = React.useState(null);

  const hightlightAndNavigate = (type, route) => {
    setSelected(type);
    navigate(route);
  };

  // const NavigationListView = (options) => {
  //   console.log(options);

  //   const values = options.length > 0 ? options : [];
  
  //   return  (
  //     <div>
  //       <Box
  //         sx={{ flexShrink: { sm: 0 }}}
  //       >
  //         <List color='primary'>
  //           {Array.from(values).map((option) => (
  //             <ListItem key={option.nav}>
  //               <ListItemButton selected={selected == option.nav} onClick={() => hightlightAndNavigate(option.nav, option.url)}>
  //                 <ListItemIcon>
  //                   <IconFactory
  //                     icon={option.icon}
  //                     color={"primary"}
  //                   >
  //                   </IconFactory>                
  //                 </ListItemIcon>
  //                 <ListItemText style={{ color: "primary" }} primary={option.label} />
  //               </ListItemButton>
  //             </ListItem>
  //           ))}
  //         </List>
  //       </Box>
  //     </div>
  //   )
  // };

  const CREATE_OPTIONS = [{
    nav: CreateForm.PLANT,
    url: "/plant/create",
    icon: "Plant",
    label: "Plant"
  },{
    nav: CreateForm.TYPE,
    url: "/type/create",
    icon: "Type",
    label: "Type"
  },{
    nav: CreateForm.GENUS,
    url: "/genus/create",
    icon: "Genus",
    label: "Genus"
  },{
    nav: CreateForm.SYSTEM,
    url: "/system/create",
    icon: "System",
    label: "System"
  },{
    nav: CreateForm.LIGHT,
    url: "/light/create",
    icon: "Light",
    label: "Light"
  },{
    nav: CreateForm.TODO,
    url: "/todo/create",
    icon: "Todo",
    label: "Todo"
  },
  ];

  const VIEW_OPTIONS = [{
    nav: ViewForm.PLANT,
    url: "/plant/view",
    icon: "Plant",
    label: "Plant"
  },{
    nav: ViewForm.SYSTEM,
    url: "/system/view",
    icon: "System",
    label: "System"
  }];

  const OPTIONS = [{
    color: "info",
    nav: NAVS.NONE,
    url: "/",
    icon: "Menu"
  },{
    color: "primary",
    nav: NAVS.HOME,
    url: "/",
    icon: "Home"
  },{
    color: "primary",
    nav: NAVS.CREATE,
    url: "/create",
    icon: "Create"
  },{
    color: "primary",
    nav: NAVS.VIEW,
    url: "/view",
    icon: "VisibilitySharp"
  },{
    color: "primary",
    nav: NAVS.ALERT,
    url: "/alerts",
    icon: "ReportGmailerrorredSharp"
  },{
    color: "primary",
    nav: NAVS.TODO,
    url: "/todos",
    icon: "TODO"
  }];

  const drawer = (
    <div>
      <div className='left_half'>
        <List width={drawerWidth}>
          {Array.from(OPTIONS).map((option) => (
            <ListItem key={option.nav} disablePadding>
              <IconButton size="large" color={option.color} onClick={() => changeNav(option)}>
                <IconFactory
                  icon={option.icon}
                  color={option.color}
                  size={"md"}
                >
                </IconFactory>
              </IconButton>
            </ListItem>
          ))}
        </List>
      </div>
      <div className='right_three_qaurter'>
        {currentNavigation === NAVS.CREATE && (
          <div>
            <Box
              sx={{ flexShrink: { sm: 0 }}}
            >
              <List color='primary'>
                {Array.from(CREATE_OPTIONS).map((option) => (
                  <ListItem key={option.nav}>
                    <ListItemButton selected={selected == option.nav} onClick={() => hightlightAndNavigate(option.nav, option.url)}>
                      <ListItemIcon>
                        <IconFactory
                          icon={option.icon}
                          color={"primary"}
                        >
                        </IconFactory>                
                      </ListItemIcon>
                      <ListItemText style={{ color: "#ffffff" }} primary={option.label} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </div>
        )}
        {currentNavigation === NAVS.VIEW && (
          <div>
            <Box
              sx={{ flexShrink: { sm: 0 }}}
            >
              <List color='primary'>
                {Array.from(VIEW_OPTIONS).map((option) => (
                  <ListItem key={option.nav}>
                    <ListItemButton selected={selected == option.nav} onClick={() => hightlightAndNavigate(option.nav, option.url)}>
                      <ListItemIcon>
                        <IconFactory
                          icon={option.icon}
                          color={"primary"}
                        >
                        </IconFactory>                
                      </ListItemIcon>
                      <ListItemText style={{ color: "#ffffff" }} primary={option.label} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </div>
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
