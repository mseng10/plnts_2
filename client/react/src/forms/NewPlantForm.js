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

  const stages = [
    "Leaf",
    "Cutting",
    "Junior",
    "Senior"
  ];

  useEffect(() => {
    // Fetch plant data from the server
    fetch('http://127.0.0.1:5000/species')
      .then((response) => response.json())
      .then((data) => setAllSpecies(data))
      .catch((error) => console.error('Error fetching plant data:', error));
  }, []);

  const [name, setName] = useState('');
  const [stage, setStage] = useState('Senior'); 
  const [size, setSize] = useState(0);
  const [cost, setCost] = useState(0);

  const [allSpecies, setAllSpecies] = useState([]);

  const [submitted, setSubmit] = useState(false);

  const handleSubmit = (event) => {
    setSubmit(true);
    event.preventDefault();
    console.log(allSpecies);
    onSave({ name, stage });
    clearForm();
    onRequestClose();
  };

  const handleCancel = () => {
    clearForm();
    onRequestClose();
  };

  const clearForm = () => {
    setName('');
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
              label="Stage"
              value={stage}
              onChange={(event) => setStage(event.target.value)}
              variant="standard"
            >
              {stages.map((stg) => (
                <MenuItem key={stg} value={stg}>{stg}</MenuItem>
              ))}
            </TextField>
            <TextField
              margin="normal"
              fullWidth
              required
              type="number"
              label="Size (inches)"
              value={size}
              onChange={(event) => setSize(event.target.value)}
              variant="standard"
            />
            <TextField
              margin="normal"
              fullWidth
              required
              type="number"
              label="Cost"
              value={cost}
              onChange={(event) => setCost(event.target.value)}
              variant="standard"
            />
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default NewPlantForm;
