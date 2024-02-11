// NewPlantForm.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import TextField from '@mui/material/TextField';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Button from '@mui/material/Button';
import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput';

const NewPlantForm = ({ isOpen, onRequestClose, onSave }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [wateringFrequency, setWateringFrequency] = useState('');
  const [lastWatered, setLastWatered] = useState('');

  const handleSubmit = () => {
    // Validate form fields if needed

    // Save the new plant
    onSave({ name, type, wateringFrequency, lastWatered });

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
    setLastWatered('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="New Plant Form"
      className="modal"
      overlayClassName="modal-overlay"
    >
      <div className="modal-content">
        <h2>New Plant Form</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            fullWidth
            required
            id="outlined-required"
            label="Name"
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
          <TextField
            margin="normal"
            fullWidth
            required
            id="outlined-required"
            label="Type"
            onChange={(event) => setType(event.target.value)}
            value={type}
          />
          <NumberInput
            aria-label="Watering Frequency:"
            placeholder="Watering Frequency…"
            value={wateringFrequency}
            onChange={(event, val) => setWateringFrequency(val)}
          />
          {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker 
              margin="normal" 
              label="Last Watered" 
              onChange={(event) => setLastWatered(event)} 
              value={lastWatered}/>
          </LocalizationProvider> */}
          <div className="button-container">
            <Button 
              type="submit" 
              primary={true} 
              variant="contained">
                Create
            </Button>
            <Button 
              variant="contained" 
              secondary={true} 
              onClick={() => handleCancel()}>
                Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default NewPlantForm;
