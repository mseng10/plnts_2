import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';

const NewPlantForm = ({ isOpen, onRequestClose, onSave }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
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
      }}
    >
      <Box sx={{ width: 400, bgcolor: 'background.paper', borderRadius: 2 }}>
        <h2 id="new-bobby-form">New Bubby</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            fullWidth
            required
            id="outlined-required"
            label="Name"
            value={name}
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
          />
          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Create
            </Button>
            <Button onClick={handleCancel} variant="outlined" color="info" sx={{ ml: 2 }}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default NewPlantForm;
