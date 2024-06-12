import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import CheckSharpIcon from '@mui/icons-material/CheckSharp';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import Autocomplete from '@mui/material/Autocomplete';


const NewPlantForm = ({ isOpen, onRequestClose }) => {

  const [name, setName] = useState('');
  const [genus, setGenus] = useState(null);
  const [type, setType] = useState(null);
  const [system, setSystem] = useState(null);
  const [size, setSize] = useState(0);
  const [cost, setCost] = useState(0);

  const [allTypes, setAllTypes] = useState([]);
  const [allGenuses, setAllGenuses] = useState([]);
  const [genusChange, setGenusChanged] = useState(false);
  const [allSystems, setAllSystems] = useState([]);

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Fetch plant data from the server
    fetch('http://127.0.0.1:5000/genus')
      .then((response) => response.json())
      .then((data) => setAllGenuses(data))
      .catch((error) => console.error('Error fetching all genuses data:', error));
    if (genus && genusChange) {
      setGenusChanged(false);
      fetch('http://127.0.0.1:5000/type')
        .then((response) => response.json())
        .then((data) => setAllTypes(data))
        .catch((error) => console.error('Error fetching all types data:', error));
    }
    fetch('http://127.0.0.1:5000/system')
      .then((response) => response.json())
      .then((data) => setAllSystems(data))
      .catch((error) => console.error('Error fetching all system data:', error));
    
  }, [genus, genusChange]);

  useEffect(() => {
    if (submitted) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({name: name, size: size, cost: cost, genus_id: genus.id, system_id: system.id, type_id: type.id })
      };
      fetch('http://127.0.0.1:5000/plants', requestOptions)
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
  }, [submitted, name, size, cost, genus, type, system, onRequestClose]);

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
    setSize(0);
    setGenus(null);
    setType(null);
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
            <Autocomplete
              freeSolo
              disableClearable
              value={genus ? genus.name : ''}
              options={allGenuses.map((option) => option.name)}
              onChange={(event) => {
                setGenusChanged(true);
                setGenus(allGenuses[event.target.value]);
              }}
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
            <Autocomplete
              freeSolo
              disableClearable
              value={type ? type.name : ''}
              options={allTypes.map((option) => option.name)}
              onChange={(event) => setType(allTypes[event.target.value])}
              renderInput={(params) => (
                <TextField
                  variant="standard"
                  {...params}
                  label="Type"
                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                  }}
                />
              )}
            />
            <Autocomplete
              freeSolo
              disableClearable
              value={system ? system.name : ''}
              options={allSystems.map((option) => option.name)}
              onChange={(event) => setSystem(allSystems[event.target.value])}
              renderInput={(params) => (
                <TextField
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
