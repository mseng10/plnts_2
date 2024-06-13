import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import CheckSharpIcon from '@mui/icons-material/CheckSharp';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ButtonGroup from '@mui/material/ButtonGroup';
import ParkSharpIcon from '@mui/icons-material/ParkSharp';

const RepotPlantsForm = ({ isOpen, plants, setPlants, onRequestClose }) => {
  const [checked, setChecked] = useState(plants);
  const [soilSomposition, setSoilSomposition] = useState(null);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleRepotPlants = () => {
    const updatedPlants = plants.map((plant) => ({
      ...plant,
      soilSomposition: soilSomposition,
    }));

    setPlants(updatedPlants);
  };

  const handleSubmit = (event) => {
    handleRepotPlants();
    event.preventDefault();
    clearForm();
    onRequestClose();
  };

  const handleCancel = () => {
    clearForm();
    onRequestClose();
  };

  const getDisplayName = (plant) => {
    return plant.name;
  };

  const clearForm = () => {
    setSoilSomposition([])
  };

  return (
    <Modal
      open={isOpen}
      onClose={onRequestClose}
      aria-labelledby="new-bobby-form"
      disableAutoFocus={true}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'inherit',
        border: 'none',
      }}
    >
      <Box sx={{ width: 512, bgcolor: 'background.paper', borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <div className='left'>
            <ParkSharpIcon className='home_icon_form' color='repot'/>
            <ButtonGroup>
              <IconButton className="left_button" type="submit" color='primary'>
                <CheckSharpIcon className="left_button"/>
              </IconButton>
              <IconButton className="left_button" color="error" onClick={handleCancel}>
                <CloseSharpIcon className="left_button"/>
              </IconButton>
            </ButtonGroup>
          </div>
          <div className="right">
            <TextField
              margin="normal"
              fullWidth
              required
              select
              label="Method"
              value={soilSomposition}
              onChange={(event) => setSoilSomposition(event.target.value)}
              variant="standard"
              color='repot'
            >
              {['slow release', 'liquid'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              {plants.map((plant) => (
                <div key={plant.id}>
                  <ListItem
                    disableGutters
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        onChange={handleToggle(plant)}
                        checked={checked.indexOf(plant) !== -1}color='repot'
                      />
                    }
                  >
                    <ListItemText primary={getDisplayName(plant)} />
                  </ListItem>
                </div>
              ))}
            </List>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default RepotPlantsForm;
