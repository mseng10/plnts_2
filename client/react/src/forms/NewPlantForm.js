// NewPlantForm.js
import React, { useState } from 'react';
import Modal from 'react-modal';

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
          <label>
            Name:
            <input type="text" value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <label>
            Type:
            <input type="text" value={type} onChange={(event) => setType(event.target.value)} required />
          </label>
          <label>
            Watering Frequency:
            <input
              type="text"
              value={wateringFrequency}
              onChange={(event) => setWateringFrequency(event.target.value)}
              required
            />
          </label>
          <label>
            Last Watered:
            <input
              type="date"
              value={lastWatered}
              onChange={(event) => setLastWatered(event.target.value)}
              required
            />
          </label>
          <div className="button-container">
            <button type="submit" className="save-button">
              Save Plant
            </button>
            <button type="button" onClick={handleCancel} className="cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default NewPlantForm;
