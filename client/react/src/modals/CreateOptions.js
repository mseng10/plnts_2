import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FingerprintSharpIcon from '@mui/icons-material/FingerprintSharp';
import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';
import TungstenSharpIcon from '@mui/icons-material/TungstenSharp';
import MergeTypeSharpIcon from '@mui/icons-material/MergeTypeSharp';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import {useNavigate} from "react-router-dom" 

const CreateOptions = () => {
  const CreateForm = Object.freeze({
    PLANT: 0,
    SYSTEM: 1,
    GENUS: 2,
    LIGHT: 3,
    TYPE: 4,
    TODO: 5
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
          <ListItem key={CreateForm.PLANT} color='secondary'>
            <ListItemButton onClick={() => navigate("/plant/create")}>
              <ListItemIcon color='secondary'>
                <GrassOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary={"Plant"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={CreateForm.TYPE}>
            <ListItemButton onClick={() => navigate("/type/create")}>
              <ListItemIcon color="info">
                <MergeTypeSharpIcon />
              </ListItemIcon>
              <ListItemText primary={"Type"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={CreateForm.GENUS}>
            <ListItemButton onClick={() => navigate("/genus/create")}>
              <ListItemIcon color="info">
                <FingerprintSharpIcon />
              </ListItemIcon>
              <ListItemText primary={"Genus"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={CreateForm.SYSTEM}>
            <ListItemButton onClick={() => navigate("/system/create")}>
              <ListItemIcon color="info">
                <PointOfSaleIcon />
              </ListItemIcon>
              <ListItemText primary={"System"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={CreateForm.LIGHT}>
            <ListItemButton onClick={() => navigate("/light/create")}>
              <ListItemIcon color="info">
                <TungstenSharpIcon />
              </ListItemIcon>
              <ListItemText primary={"Light"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={CreateForm.TODO}>
            <ListItemButton onClick={() => navigate("/todo/create")}>
              <ListItemIcon color="info">
                <FormatListNumberedIcon />
              </ListItemIcon>
              <ListItemText primary={"TODO"} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </div>
  );
};

export default CreateOptions;
