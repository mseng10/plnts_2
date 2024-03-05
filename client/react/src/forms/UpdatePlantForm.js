import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import CheckSharpIcon from '@mui/icons-material/CheckSharp';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';


const UpdatePlantForm = ({ isOpen, onRequestClose, setPlants, plant }) => {

  // TODO: Turn to server side
  const typesToGenus = new Map([
    [null, []],
    ["Succulent", ["Echeveria"]],
    ["Cactus", ["Old Man"]],
    ["Philodendron", ["Pink Princess", "White Princess"]],
    ["Monstera", ["Albo", "Thai Constelation"]]
  ])

  const [updatedName, setUpdatedName] = useState(plant.name);
  const [updatedType, setUpdatedType] = useState(plant.type);
  const [updatedWateringFrequency, setUpdatedWateringFrequency] = useState(plant.wateringFrequency);
  const [updatedLastWatered, setUpdatedLastWatered] = useState(plant.lastWatered);
  const [submitted, setSubmit] = useState(false);
  const [types, setTypes] = useState(Array.from(typesToGenus.keys()))
  const [genus, setUpdatedGenus] = useState('Echeveria');

  useEffect(() => {
    // Update form fields when the plant prop changes
    setUpdatedName(plant.name);
    setUpdatedType(plant.type);
    setUpdatedWateringFrequency(plant.wateringFrequency);
    setUpdatedLastWatered(plant.lastWatered);
  }, [plant]);

  useEffect(() => {
    // Fetch plant data from the server
    fetch('https://localhost/types')
      .then((response) => response.json())
      .then((data) => setTypes(data? Array.from(typesToGenus.keys()) : Array.from(typesToGenus.keys())))
      .catch((error) => console.error('Error fetching plant data:', error));
  }, []);

  const handleSubmit = (event) => {
    setSubmit(true);
    event.preventDefault();
    handleUpdatePlant({...plant, name: updatedName, type: updatedType,genus: genus, wateringFrequency: updatedWateringFrequency, lastWatered: updatedLastWatered });
    clearForm();
    onRequestClose();
  };

  const handleCancel = () => {
    clearForm();
    onRequestClose();
  };

  const clearForm = () => {
    setUpdatedName('');
    setUpdatedType('');
    setUpdatedGenus('');
    setUpdatedWateringFrequency('');
  };


  const handleUpdatePlant = (updatedPlant) => {
    // Update the plant data on the server or perform other actions
    setPlants((prevPlants) =>
      prevPlants.map((plant) => (plant.id === updatedPlant.id ? updatedPlant : plant))
    );
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
            <GrassOutlinedIcon color='info' className={submitted ? 'home_icon_form_submit' : 'home_icon_form'}/>
            <ButtonGroup>
              <IconButton className="left_button" type="submit" color="primary">
                <CheckSharpIcon className="left_button"/>
              </IconButton>
              <IconButton className="left_button" color="error" onClick={handleCancel}>
                <CloseSharpIcon className="left_button"/>
              </IconButton>
            </ButtonGroup>
          </div>
          <div className='right'>
            <TextField
              margin="normal"
              fullWidth
              required
              label="Name"
              value={updatedName}
              variant="standard"
              onChange={(event) => setUpdatedName(event.target.value)}
            />
            <TextField
              margin="normal"
              fullWidth
              required
              select
              label="Type"
              value={updatedType}
              onChange={(event) => setUpdatedType(event.target.value)}
              variant="standard"
            >
              {types.map((ty) => (
                <MenuItem key={ty} value={ty}>{ty}</MenuItem>
              ))}
            </TextField>
            <TextField
              margin="normal"
              fullWidth
              required
              select
              label="Genus"
              value={genus}
              onChange={(event) => setUpdatedGenus(event.target.value)}
              variant="standard"
            >
              {typesToGenus.get(updatedType).map((gen) => (
                <MenuItem key={gen} value={gen}>{gen}</MenuItem>
              ))}
            </TextField>
            <TextField
              margin="normal"
              fullWidth
              required
              type="number"
              label="Watering Frequency"
              value={updatedWateringFrequency}
              onChange={(event) => setUpdatedWateringFrequency(event.target.value)}
              variant="standard"
            />
            {/* <label>
            Last Watered:
            <input
              type="date"
              value={updatedLastWatered}
              onChange={(event) => setUpdatedLastWatered(event.target.value)}
              required
            />
          </label> */}
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default UpdatePlantForm;
