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

  const [selected, setSelected] = React.useState(null);

  const navigate = useNavigate();

  const hightlightAndNavigate = (type, route) => {
    setSelected(type);
    navigate(route);
  };

  return (
    <div>
      <Box
        sx={{ flexShrink: { sm: 0 }}}
      >
        <List>
          <ListItem key={ViewForm.PLANT} >
            <ListItemButton selected={selected == ViewForm.PLANT} onClick={() => hightlightAndNavigate(ViewForm.PLANT, "/plant/view")}>
              <ListItemIcon key={ViewForm.PLANT}>
                <GrassOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary={"Plant"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={ViewForm.SYSTEM}>
            <ListItemButton selected={selected == ViewForm.SYSTEM} onClick={() => hightlightAndNavigate(ViewForm.SYSTEM, "/system/view")}>
              <ListItemIcon>
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
