import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import CheckSharpIcon from '@mui/icons-material/CheckSharp';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';


const NewSystemForm = ({ isOpen, onRequestClose }) => {
  const [name, setName] = useState('');
  const [humidity, setHumidity] = useState(0);
  const [temperature, setTempurature] = useState(0);
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);

  const [allSystems, setAllSystems] = useState([]);
  
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('http://127.0.0.1:5000/system')
        .then((response) => response.json())
        .then((data) => setAllSystems(data))
        .catch((error) => console.error('Error fetching genus data:', error));
    }
  }, []);

  useEffect(() => {
    if (submitted) {
      console.log(allSystems);
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, humidity: humidity, temperature: temperature, distance: distance, duration: duration })
      };
      fetch('http://127.0.0.1:5000/system', requestOptions)
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
  }, [submitted, name, temperature, humidity, distance, duration, onRequestClose]);

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
    setTempurature(0);
    setHumidity(0);
    setDistance(0);
    setDuration(0);
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
      <Box sx={{ width: 512, bgcolor: 'background.paper', borderRadius: 2 }} display="flex">
        <form onSubmit={handleSubmit}>
          <Box sx={{ width: 512, bgcolor: 'background.paper', borderRadius: 2  }}>
            <div className='left'>
              <PointOfSaleIcon color='info' className={submitted ? 'home_icon_form_submit' : 'home_icon_form'}/>
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
                type="number"
                label="Humidity"
                value={humidity}
                onChange={(event) => setHumidity(event.target.value)}
                variant="standard"
              />
              <TextField
                margin="normal"
                fullWidth
                required
                type="number"
                label="Temperature"
                value={temperature}
                onChange={(event) => setTempurature(event.target.value)}
                variant="standard"
              />
            </div>
          </Box>
          <Box>
            <div>
              <TextField
                margin="normal"
                fullWidth
                required
                type="number"
                label="Duration (hours)"
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                variant="standard"
                color="light"
              />
              <TextField
                margin="normal"
                fullWidth
                required
                type="number"
                label="Distance (inches)"
                value={distance}
                onChange={(event) => setDistance(event.target.value)}
                variant="standard"
                color="light"
              />
            </div>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default NewSystemForm;


