// UpdatePlantForm.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const UpdatePlantForm = ({ isOpen, onRequestClose, onUpdate, plant }) => {
  const [updatedName, setUpdatedName] = useState(plant.name);
  const [updatedType, setUpdatedType] = useState(plant.type);
  const [updatedWateringFrequency, setUpdatedWateringFrequency] = useState(plant.wateringFrequency);

  useEffect(() => {
    // Update form fields when the plant prop changes
    setUpdatedName(plant.name);
    setUpdatedType(plant.type);
    setUpdatedWateringFrequency(plant.wateringFrequency);
  }, [plant]);

  const handleSubmit = () => {
    // Validate form fields if needed

    // Update the plant
    onUpdate({ ...plant, name: updatedName, type: updatedType, wateringFrequency: updatedWateringFrequency });

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
          <label>
            Name:
            <input type="text" value={updatedName} onChange={(event) => setUpdatedName(event.target.value)} required />
          </label>
          <label>
            Type:
            <input type="text" value={updatedType} onChange={(event) => setUpdatedType(event.target.value)} required />
          </label>
          <label>
            Watering Frequency:
            <input
              type="text"
              value={updatedWateringFrequency}
              onChange={(event) => setUpdatedWateringFrequency(event.target.value)}
              required
            />
          </label>
          <div className="button-container">
            <button type="submit" className="update-button">Update Plant</button>
            <button type="button" onClick={handleCancel} className="cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UpdatePlantForm;
