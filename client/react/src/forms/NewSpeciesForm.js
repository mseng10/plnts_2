import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import CheckSharpIcon from '@mui/icons-material/CheckSharp';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import Autocomplete from '@mui/material/Autocomplete';
import CallSplitSharpIcon from '@mui/icons-material/CallSplitSharp';


const NewSpeciesForm = ({ isOpen, onRequestClose }) => {
  const [name, setName] = useState('');
  const [genus, setGenus] = useState(null);
  const [allGenus, setAllGenus] = useState([]);
  const [allSpecies, setAllSpecies] = useState([]);
  const [submitted, setSubmitted] = useState(false); // Initialize submitted state

  useEffect(() => {
    fetch('http://127.0.0.1:5000/genus')
      .then((response) => response.json())
      .then((data) => setAllGenus(data))
      .catch((error) => console.error('Error fetching genus data:', error));
    fetch('http://127.0.0.1:5000/species')
      .then((response) => response.json())
      .then((data) => setAllSpecies(data))
      .catch((error) => console.error('Error fetching species data:', error));
  }, []);

  useEffect(() => {
    if (submitted) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, genus_id: genus.id })
      };
      fetch('http://127.0.0.1:5000/species', requestOptions)
        .then(response => response.json())
        .then(data => {
          // handle the response data if needed
          // maybe update some state based on the response
          console.log(data);
        })
        .catch(error => console.error('Error posting species data:', error));
      clearForm();
      onRequestClose();
    }
  }, [submitted, name, genus, onRequestClose]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (allSpecies.find(species => species.name === name && species.genus.id === genus.id)) {
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
    setGenus(null);
    setSubmitted(false);
  };

  return (
    <Modal
      open={isOpen}
      onClose={onRequestClose}
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
            <CallSplitSharpIcon color='info' className={submitted ? 'home_icon_form_submit' : 'home_icon_form'}/>
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
            <Autocomplete
              freeSolo
              disableClearable
              value={genus ? genus.name : null}
              options={allGenus.map((option) => option.name)}
              onChange={(event) => setGenus(allGenus[event.target.value])}
              renderInput={(params) => (
                <TextField
                  variant="standard"
                  {...params}
                  label="Genus"
                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                  }}
                />
              )}
            />
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default NewSpeciesForm;


