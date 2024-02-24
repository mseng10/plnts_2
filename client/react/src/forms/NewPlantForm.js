import React, { useState } from 'react';
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
  const [name, setName] = useState('');
  const [type, setType] = useState('Succulent');
  const [wateringFrequency, setWateringFrequency] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Validate form fields if needed

    // Save the new plant
    onSave({ name, type, wateringFrequency });

    // Clear form fields
    clearForm();

    // Close the modal
    onRequestClose();
  };

  const handleCancel = () => {
    // Clear form fields
    clearForm();

    // Close the modal
    onRequestClose();
  };

  const clearForm = () => {
    setName('');
    setType('');
    setWateringFrequency('');
  };

  return (
    <Modal
      open={isOpen}
      onClose={onRequestClose}
      aria-labelledby="new-bobby-form"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'inherit',
        border: 'none',
        outline: 'none'
      }}
    >
      <Box sx={{ width: 512, bgcolor: 'background.paper', borderRadius: 2 }}>
        <form onSubmit={handleSubmit} >
          <div className='left'>
            <GrassOutlinedIcon color='info' className='home_icon_form'/>
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
              <MenuItem value="Succulent">Succulent</MenuItem>
              <MenuItem value="Cactus">Cactus</MenuItem>
              <MenuItem value="Philodendron">Philodendron</MenuItem>
              <MenuItem value="Monstera">Monstera</MenuItem>
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
