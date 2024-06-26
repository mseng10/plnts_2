import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import CheckSharpIcon from '@mui/icons-material/CheckSharp';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import Autocomplete from '@mui/material/Autocomplete';
import TungstenSharpIcon from '@mui/icons-material/TungstenSharp';


const NewLightForm = ({ isOpen, onRequestClose, systems }) => {

  const [name, setName] = useState('');
  const [system, setSystem] = useState(null);
  const [cost, setCost] = useState(0);

  const [allSystems, setAllSystems] = useState([]);

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen && !systems) {
      fetch('http://127.0.0.1:5000/system')
        .then((response) => response.json())
        .then((data) => setAllSystems(data))
        .catch((error) => console.error('Error fetching all system data:', error));
    }
  }, [isOpen, systems]);

  useEffect(() => {
    if (submitted) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({name: name, cost: cost, system_id: system.id })
      };
      fetch('http://127.0.0.1:5000/light', requestOptions)
        .then(response => response.json())
        .then(data => {
          // handle the response data if needed
          // maybe update some state based on the response
          console.log(data);
        })
        .catch(error => console.error('Error posting plants data:', error));
      clearForm();
      onRequestClose();
    }
  }, [submitted, name, cost, system, onRequestClose]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true); // Update submitted state
  };

  const handleCancel = () => {
    clearForm();
    onRequestClose();
  };

  const clearForm = () => {
    setName('');
    setCost(0);
    setSystem(null);
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
      <Box sx={{ width: 560, bgcolor: 'background.paper', borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <div className='left'>
            <TungstenSharpIcon color="light" className={'home_icon_form'}/>
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
              color="light"
              margin="normal"
              fullWidth
              required
              label="Name"
              value={name}
              variant="standard"
              onChange={(event) => setName(event.target.value)}
            />
            <Autocomplete
              freeSolo
              color="light"
              disableClearable
              value={system ? system.name : ''}
              options={allSystems.map((option) => option.name)}
              onChange={(event) => setSystem(allSystems[event.target.value])}
              renderInput={(params) => (
                <TextField
                  color="light"
                  variant="standard"
                  {...params}
                  label="System"
                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                  }}
                />
              )}
            />
            <TextField
              margin="normal"
              color="light"
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

export default NewLightForm;
