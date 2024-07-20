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
// import Typography from '@mui/material/Typography';
// <Typography variant="body2" color={'secondary'}> MyTitle</Typography>

const CreateOptions = () => {
  const CreateForm = Object.freeze({
    PLANT: 0,
    SYSTEM: 1,
    GENUS: 2,
    LIGHT: 3,
    TYPE: 4,
    TODO: 5
  });

  const [selected, setSelected] = React.useState(CreateForm.PLANT);

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
        <List color='primary'>
          <ListItem key={CreateForm.PLANT}>
            <ListItemButton selected={selected == CreateForm.PLANT} onClick={() => hightlightAndNavigate(CreateForm.PLANT, "/plant/create")}>
              <ListItemIcon>
                <GrassOutlinedIcon color='primary'/>
              </ListItemIcon>
              <ListItemText style={{ color: '#ffffff' }} primary={"Plant"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={CreateForm.TYPE}>
            <ListItemButton selected={selected == CreateForm.TYPE} onClick={() => hightlightAndNavigate(CreateForm.TYPE, "/type/create")}>
              <ListItemIcon>
                <MergeTypeSharpIcon color='primary'/>
              </ListItemIcon>
              <ListItemText style={{ color: '#ffffff' }} primary={"Type"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={CreateForm.GENUS}>
            <ListItemButton selected={selected == CreateForm.GENUS} onClick={() => hightlightAndNavigate(CreateForm.GENUS, "/genus/create")}>
              <ListItemIcon>
                <FingerprintSharpIcon color='primary'/>
              </ListItemIcon>
              <ListItemText style={{ color: '#ffffff' }} primary={"Genus"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={CreateForm.SYSTEM}>
            <ListItemButton selected={selected == CreateForm.SYSTEM} onClick={() => hightlightAndNavigate(CreateForm.SYSTEM, "/system/create")}>
              <ListItemIcon>
                <PointOfSaleIcon color='primary'/>
              </ListItemIcon>
              <ListItemText style={{ color: '#ffffff' }} primary={"System"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={CreateForm.LIGHT}>
            <ListItemButton selected={selected == CreateForm.LIGHT} onClick={() => hightlightAndNavigate(CreateForm.LIGHT, "/light/create")}>
              <ListItemIcon>
                <TungstenSharpIcon color='primary'/>
              </ListItemIcon>
              <ListItemText style={{ color: '#ffffff' }} primary={"Light"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={CreateForm.TODO}>
            <ListItemButton selected={selected == CreateForm.TODO} onClick={() => hightlightAndNavigate(CreateForm.TODO, "/todo/create")}>
              <ListItemIcon>
                <FormatListNumberedIcon color='primary'/>
              </ListItemIcon>
              <ListItemText style={{ color: '#ffffff' }} primary={"TODO"} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </div>
  );
};

export default CreateOptions;
