// UpdatePlantForm.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput';

const UpdatePlantForm = ({ isOpen, onRequestClose, onUpdate, plant }) => {
  console.log(plant);
  const [updatedName, setUpdatedName] = useState(plant.name);
  const [updatedType, setUpdatedType] = useState(plant.type);
  const [updatedWateringFrequency, setUpdatedWateringFrequency] = useState(plant.wateringFrequency);
  const [updatedLastWatered, setUpdatedLastWatered] = useState(plant.lastWatered);

  useEffect(() => {
    // Update form fields when the plant prop changes
    setUpdatedName(plant.name);
    setUpdatedType(plant.type);
    setUpdatedWateringFrequency(plant.wateringFrequency);
    setUpdatedLastWatered(plant.lastWatered);
  }, [plant]);

  const handleSubmit = () => {
    // Validate form fields if needed

    // Update the plant
    onUpdate({...plant, name: updatedName, type: updatedType, wateringFrequency: updatedWateringFrequency, lastWatered: updatedLastWatered });

    // Close the modal
    onRequestClose();
  };

  const handleCancel = () => {
    // Close the modal
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Update Plant Form"
      className="modal"
      overlayClassName="modal-overlay"
    >
      <div className="modal-content">
        <h2>Update Plant Form</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            fullWidth
            required
            id="outlined-required"
            label="Name"
            onChange={(event) => setUpdatedName(event.target.value)}
            value={plant.name}
          />
          <TextField
            margin="normal"
            fullWidth
            required
            id="outlined-required"
            label="Type"
            onChange={(event) => setUpdatedType(event.target.value)}
            value={plant.type}
          />
          <NumberInput
            aria-label="Watering Frequency:"
            placeholder="Watering Frequency…"
            value={plant.updatedWateringFrequency}
            onChange={(event, val) => setUpdatedWateringFrequency(val)}
          />
          <label>
            Watering Frequency:
            <input
              type="text"
              value={updatedWateringFrequency}
              onChange={(event) => setUpdatedWateringFrequency(event.target.value)}
              required
            />
          </label>
          <label>
            Last Watered:
            <input
              type="date"
              value={updatedLastWatered}
              onChange={(event) => setUpdatedLastWatered(event.target.value)}
              required
            />
          </label>
          <div className="button-container">
            <Button 
              type="submit" 
              primary={true} 
              variant="outlined">
                Update
            </Button>
            <Button 
              variant="outlined"
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

export default UpdatePlantForm;
