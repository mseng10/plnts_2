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

const NewPlantForm = ({ isOpen, onRequestClose, onSave }) => {
  // TODO: Turn to server side
  const typesToGenus = new Map([
    ["Succulent", ["Echeveria"]],
    ["Cactus", ["Old Man"]],
    ["Philodendron", ["Pink Princess", "White Princess"]],
    ["Monstera", ["Albo", "Thai Constelation"]]
  ])


  useEffect(() => {
    // Fetch plant data from the server
    fetch('https://localhost/types')
      .then((response) => response.json())
      .then((data) => setTypes(data? Array.from(typesToGenus.keys()) : Array.from(typesToGenus.keys())))
      .catch((error) => console.error('Error fetching plant data:', error));
  }, []);

  const [name, setName] = useState('');
  const [type, setType] = useState('Succulent');
  const [genus, setGenus] = useState('Echeveria');
  const [wateringFrequency, setWateringFrequency] = useState(14);
  const [submitted, setSubmit] = useState(false);

  const [types, setTypes] = useState(Array.from(typesToGenus.keys()))

  const handleSubmit = (event) => {
    setSubmit(true);
    event.preventDefault();
    onSave({ name, type, wateringFrequency, genus });
    clearForm();
    onRequestClose();
  };

  const handleCancel = () => {
    clearForm();
    onRequestClose();
  };

  const clearForm = () => {
    setName('');
    setType('Succulent');
    setGenus('Echeveria');
    setWateringFrequency('');
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
              value={name}
              variant="standard"
              onChange={(event) => setName(event.target.value)}
            />
            <TextField
              margin="normal"
              fullWidth
              required
              select
              label="Type"
              value={type}
              onChange={(event) => setType(event.target.value)}
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
              onChange={(event) => setGenus(event.target.value)}
              variant="standard"
            >
              {typesToGenus.get(type).map((gen) => (
                <MenuItem key={gen} value={gen}>{gen}</MenuItem>
              ))}
            </TextField>
            <TextField
              margin="normal"
              fullWidth
              required
              type="number"
              label="Watering Frequency"
              value={wateringFrequency}
              onChange={(event) => setWateringFrequency(event.target.value)}
              variant="standard"
            />
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default NewPlantForm;
