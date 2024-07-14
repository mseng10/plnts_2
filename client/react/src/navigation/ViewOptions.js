import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import {useNavigate} from "react-router-dom" 

const ViewOptions = () => {
  const ViewForm = Object.freeze({
    PLANT: 0,
    SYSTEM: 1,
  });

  const navigate = useNavigate();

  return (
    <div>
      <Box
        sx={{ flexShrink: { sm: 0 }}}
        aria-label="mailbox folders"
        backgroundColor='secondary' 
      >
        <List color='secondary'>
          <ListItem key={ViewForm.PLANT} color='secondary'>
            <ListItemButton onClick={() => navigate("/plant/view")}>
              <ListItemIcon color='secondary'>
                <GrassOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary={"Plant"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={ViewForm.SYSTEM}>
            <ListItemButton onClick={() => navigate("/system/view")}>
              <ListItemIcon color="info">
                <PointOfSaleIcon />
              </ListItemIcon>
              <ListItemText primary={"System"} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </div>
  );
};

export default ViewOptions;
