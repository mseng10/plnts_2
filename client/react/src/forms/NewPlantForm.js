import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput';

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
      aria-labelledby="new-plant-form"
    >
      <div className="modal-content">
        <h2 id="new-plant-form">New Plant Form</h2>
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
            id="outlined-required"
            label="Type"
            value={type}
            onChange={(event) => setType(event.target.value)}
          />
          <NumberInput
            margin="normal"
            fullWidth
            required
            label="Watering Frequency"
            value={wateringFrequency}
            onChange={(event) => setWateringFrequency(event.target.value)}
          />
          <div className="button-container">
            <Button type="submit" variant="contained" color="primary">
              Create
            </Button>
            <Button onClick={handleCancel} variant="outlined" color="secondary">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default NewPlantForm;
