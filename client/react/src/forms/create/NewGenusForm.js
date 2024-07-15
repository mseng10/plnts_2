import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import CheckSharpIcon from '@mui/icons-material/CheckSharp';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import FingerprintSharpIcon from '@mui/icons-material/FingerprintSharp';
import {useNavigate} from "react-router-dom" 

/** Create a genus. Ideally not really used. */
const NewGenusForm = () => {
  // Form Fields
  const [name, setName] = useState('');
  const [watering, setWatering] = useState(0);
  
  // Submitted state
  const [submitted, setSubmitted] = useState(false);

  // Navigation
  const navigate = useNavigate();

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
      handleCancel();
      navigate("/");
    }
  }, [submitted, name, watering]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true); // Update submitted state
  };

  const handleCancel = () => {
    clearForm();
    navigate("/create");
  };

  const clearForm = () => {
    setName('');
    setWatering(0);
    setSubmitted(false);
  };

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ width: 512, bgcolor: 'background.paper', borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <div className='left'>
            <FingerprintSharpIcon color='genus' className='home_icon_form'/>
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
              color="genus"
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
              color="genus"
              variant="standard"
            />
          </div>
        </form>
      </Box>
    </Box>
  );
};

export default NewGenusForm;
