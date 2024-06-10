import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import CheckSharpIcon from '@mui/icons-material/CheckSharp';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import AvTimerSharpIcon from '@mui/icons-material/AvTimerSharp';
import StraightenSharpIcon from '@mui/icons-material/StraightenSharp';

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

  const durationMarks = [
    {
      value: 6,
      label: '6',
    },
    {
      value: 12,
      label: '12',
    },
    {
      value: 18,
      label: '18',
    }
  ]

  const measureMarks = [
    {
      value: 12,
      label: '12"',
    },
    {
      value: 24,
      label: '24"',
    },
    {
      value: 36,
      label: '36"',
    }
  ];

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
      <Box sx={{ width: 800, height: 312, borderRadius: 2 }} display="flex">
        <form onSubmit={handleSubmit}>
          <Box sx={{ width: 512, height: 312, bgcolor: 'background.paper', borderRadius: 2, float:'left', paddingRight: 2, paddingLeft: 4  }}>
            <div className='left'>
              <PointOfSaleIcon color='info' className={'home_icon_form'}/>
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
          <Box sx={{ width: 256, height: 312, bgcolor: 'background.paper', borderRadius: 2, float:'right', paddingRight: 2, marginLeft: 4  }}>
            <Stack spacing={2} direction="row" alignItems="center" color="light" height={48}>
              <AvTimerSharpIcon color="light" sx={{fontSize:40}} />
              <Slider
                color="info" 
                aria-label="Duration" 
                value={duration} 
                onChange={(event) => setDuration(event.target.value)}
                variant="standard"
                defaultValue={12}
                step={1}
                marks={durationMarks}
                min={6}
                max={18}
                valueLabelDisplay="auto"
              />
            </Stack>
            <Stack spacing={2} direction="row" alignItems="center" color="light" height={48}>
              <StraightenSharpIcon color="light" sx={{fontSize:40}}/>
              <Slider 
                color="info" 
                aria-label="Distance (inches)" 
                value={distance} 
                onChange={(event) => setDistance(event.target.value)}
                variant="standard"
                defaultValue={24}
                step={2}
                marks={measureMarks}
                min={12}
                max={36}
                valueLabelDisplay="auto"
              />
            </Stack>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default NewSystemForm;


