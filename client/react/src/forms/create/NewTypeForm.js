import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import CheckSharpIcon from '@mui/icons-material/CheckSharp';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import MergeTypeSharpIcon from '@mui/icons-material/MergeTypeSharp';
import Autocomplete from '@mui/material/Autocomplete';

/** Create a new plant type of a specified genus. */
const NewTypeForm = ({ isOpen, onRequestClose }) => {
  // Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [genus, setGenus] = useState(null);

  // Field Populators
  const [allGenuses, setAllGenuses] = useState([]);

  // Submitted state
  const [submitted, setSubmitted] = useState(false); // Initialize submitted state

  useEffect(() => {
    if (isOpen && allGenuses.length == 0) {
      fetch('http://127.0.0.1:5000/genus')
        .then((response) => response.json())
        .then((data) => setAllGenuses(data))
        .catch((error) => console.error('Error fetching genus data:', error));
    }
  }, [isOpen, allGenuses]);

  useEffect(() => {
    if (submitted) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, description: description, genus_id: genus.id })
      };
      fetch('http://127.0.0.1:5000/type', requestOptions)
        .then(response => response.json())
        .then(data => {
          // handle the response data if needed
          // maybe update some state based on the response
          console.log(data);
        })
        .catch(error => console.error('Error posting type data:', error));
      clearForm();
      onRequestClose();
    }
  }, [submitted, name, description, genus, onRequestClose]);

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
    setDescription('');
    setGenus(null);
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
            <MergeTypeSharpIcon color='type' className={'home_icon_form'}/>
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
              color="type"
              onChange={(event) => setName(event.target.value)}
            />
            <Autocomplete
              freeSolo
              disableClearable
              value={genus ? genus.name : ''}
              options={allGenuses.map((option) => option.name)}
              onChange={(event) => setGenus(allGenuses[event.target.value])}
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
            <TextField
              margin="normal"
              multiline
              rows={6}
              fullWidth
              required
              label="Description"
              value={description}
              variant="standard"
              color="type"
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default NewTypeForm;


