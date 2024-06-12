import React, { useState, useEffect } from 'react';
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
import LunchDiningIcon from '@mui/icons-material/LunchDining';

const FertilizePlantsForm = ({ isOpen, plants, setPlants, onRequestClose }) => {
  const [checked, setChecked] = useState(plants);
  const [method, setMethod] = useState('');
  const [composition, setComposition] = useState([-1,-1,-1]);

  const setN = (val) => {
    composition[0] = val;
  };

  const setP = (val) => {
    composition[1] = val;
  };

  const setK = (val) => {
    composition[2] = val;
  };

  useEffect(() => {
    // Fetch plant data from the server
    fetch('https://localhost/types')
      .then((response) => response.json())
      .then(() => setMethod('slow release'))
      .catch((error) => console.error('Error fetching plant data:', error));
  }, []);

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

  const handleFertilizePlants = () => {
    const updatedPlants = plants.map((plant) => ({
      ...plant,
      last_fertilized_at: Date.now(),
      fertilizations: [
        ...(plant.fertilizations || []),
        {
          method,
          composition
        },
      ],
    }));

    setPlants(updatedPlants);
  };

  const handleSubmit = (event) => {
    handleFertilizePlants();
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
    setMethod('');
    setComposition({})
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
            <LunchDiningIcon className='home_icon_form_submit' color='fertilize'/>
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
              value={method}
              onChange={(event) => setMethod(event.target.value)}
              variant="standard"
              color='fertilize'
            >
              {['slow release', 'liquid'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="normal"
              fullWidth
              required
              type="number"
              label="N"
              value={composition[0]}
              onChange={(event) => setN(event.target.value)}
              variant="standard"
              color='fertilize'
            />
            <TextField
              margin="normal"
              fullWidth
              required
              type="number"
              label="P"
              value={composition[1]}
              onChange={(event) => setP(event.target.value)}
              variant="standard"
              color='fertilize'
            />
            <TextField
              margin="normal"
              fullWidth
              required
              type="number"
              label="K"
              value={composition[2]}
              onChange={(event) => setK(event.target.value)}
              variant="standard"
              color='fertilize'
            />
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              {plants.map((plant) => (
                <div key={plant.id}>
                  <ListItem
                    disableGutters
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        onChange={handleToggle(plant)}
                        checked={checked.indexOf(plant) !== -1}color='fertilize'
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

export default FertilizePlantsForm;
