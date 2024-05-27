import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import CheckSharpIcon from '@mui/icons-material/CheckSharp';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';


const NewGenusForm = ({ isOpen, onRequestClose }) => {
  const [name, setName] = useState('');
  const [watering, setWatering] = useState(0);
  const [allGenus, setAllGenus] = useState([]);
  const [submitted, setSubmitted] = useState(false); // Initialize submitted state

  useEffect(() => {
    fetch('http://127.0.0.1:5000/genus')
      .then((response) => response.json())
      .then((data) => setAllGenus(data))
      .catch((error) => console.error('Error fetching genus data:', error));
  }, []);

  useEffect(() => {
    if (submitted) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, watering: watering })
      };
      fetch('http://127.0.0.1:5000/genus', requestOptions)
        .then(response => response.json())
        .then(data => {
          // handle the response data if needed
          // maybe update some state based on the response
          console.log(data);
        })
        .catch(error => console.error('Error posting genus data:', error));
      clearForm();
      onRequestClose();
    }
  }, [submitted, name, watering, onRequestClose]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (allGenus.find(genus => genus.name === name)) {
      return;
    }
    setSubmitted(true); // Update submitted state
  };

  const handleCancel = () => {
    clearForm();
    onRequestClose();
  };

  const clearForm = () => {
    setName('');
    setWatering(0);
    setSubmitted(false);
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
              label="Genus Name"
              value={name}
              variant="standard"
              onChange={(event) => setName(event.target.value)}
            />
            <TextField
              margin="normal"
              fullWidth
              required
              type="number"
              label="Watering (days)"
              value={watering}
              onChange={(event) => setWatering(event.target.value)}
              variant="standard"
            />
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default NewGenusForm;


