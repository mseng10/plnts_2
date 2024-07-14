import React, { useState, useEffect } from 'react';
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
import InvertColorsSharpIcon from '@mui/icons-material/InvertColorsSharp';
import DeviceThermostatSharpIcon from '@mui/icons-material/DeviceThermostatSharp';
import TungstenSharpIcon from '@mui/icons-material/TungstenSharp';
import Autocomplete from '@mui/material/Autocomplete';


/** Create a system that houses plants */
const NewSystemForm = ({ isOpen, onRequestClose, systems }) => {
  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('')
  const [humidity, setHumidity] = useState(60);
  const [temperature, setTempurature] = useState(68);
  const [duration, setDuration] = useState(12);
  const [distance, setDistance] = useState(24);

  // Light Count
  const [lightModel, setLightModel] = useState(null);
  const [lightCount, setLightCount] = useState(1);
  const [allLights, setAllLights] = useState([]); 

  // Background Information
  const [allSystems, setAllSystems] = useState(systems);
  
  // Submitted State
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen && !allSystems) {
      fetch('http://127.0.0.1:5000/system')
        .then((response) => response.json())
        .then((data) => setAllSystems(data))
        .catch((error) => console.error('Error fetching genus data:', error));
      fetch('http://127.0.0.1:5000/light')
        .then((response) => response.json())
        .then((data) => setAllLights(data))
        .catch((error) => console.error('Error fetching lights data:', error));
    }
  }, [isOpen, allSystems]);

  useEffect(() => {
    if (submitted) {
      if (lightModel) {
        lightModel.count = lightCount;
      }
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: name,
          description: description,
          humidity: humidity,
          temperature: temperature,
          distance: distance,
          duration: duration,
          light: lightModel
        })
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
  }, [submitted, name, description, temperature, humidity, distance, duration, onRequestClose,lightModel ]);

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
    setTempurature(0);
    setHumidity(0);
    setDistance(0);
    setDuration(0);
    setSubmitted(false);
    setLightModel(null);
    setLightCount(0);
  };

  // Target temperature marks
  const temperatureMarks = [
    {
      value: 48,
      label: '48',
    },
    {
      value: 68,
      label: '68°F',
    },
    {
      value: 80,
      label: '80°F',
    }
  ];

  // Humidity field marks
  const humidityMarks = [
    {
      value: 0,
      label: '0%',
    },
    {
      value: 60,
      label: '60%',
    },
    {
      value: 100,
      label: '100%',
    }
  ];

  // Duration field marks
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
  ];

  // Lighting field marks
  const distanceMarks = [
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
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ width: 800, height: 312, borderRadius: 2 }} display="flex">
        <form onSubmit={handleSubmit}>
          <Box sx={{ width: 512, height: 312, bgcolor: 'background.paper', borderRadius: 2, float:'left', paddingRight: 2, paddingLeft: 4  }}>
            <div className='left'>
              <PointOfSaleIcon color='secondary' className={'home_icon_form'}/>
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
                color='secondary'
              />
              <TextField
                label="Description"
                multiline
                rows={6}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                variant="standard"
                fullWidth
                margin="normal"
                color='secondary'
              />
            </div>
          </Box>
          <Box sx={{ width: 256, height: 312, bgcolor: 'background.paper', borderRadius: 2, float:'right', paddingRight: 2, marginLeft: 4  }}>
            <Stack spacing={2} direction="row" alignItems="center" color="light" height={64}>
              <InvertColorsSharpIcon color="light" sx={{fontSize:40,color: '#3f51b5'}} />
              <Slider
                color="info"
                required
                aria-label="Humidity" 
                value={humidity} 
                onChange={(event) => setHumidity(event.target.value)}
                variant="standard"
                defaultValue={12}
                step={1}
                marks={humidityMarks}
                min={0}
                max={100}
                valueLabelDisplay="auto"
              />
            </Stack>
            <Stack spacing={2} direction="row" alignItems="center" color="light" height={64}>
              <DeviceThermostatSharpIcon color="light" sx={{fontSize:40 , color: '#ff9800'}}/>
              <Slider 
                color="info" 
                aria-label="Distance (inches)" 
                value={temperature} 
                onChange={(event) => setTempurature(event.target.value)}
                variant="standard"
                step={2}
                marks={temperatureMarks}
                min={48}
                max={80}
                valueLabelDisplay="auto"
              />
            </Stack>
            <Stack spacing={2} direction="row" alignItems="center" color="light" height={64}>
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
            <Stack spacing={2} direction="row" alignItems="center" color="light" height={64}>
              <StraightenSharpIcon color="info" sx={{fontSize:40}}/>
              <Slider 
                color="info" 
                aria-label="Distance (inches)" 
                value={distance} 
                onChange={(event) => setDistance(event.target.value)}
                variant="standard"
                defaultValue={24}
                step={2}
                marks={distanceMarks}
                min={12}
                max={36}
                valueLabelDisplay="auto"
              />
            </Stack>
          </Box>
          <Box sx={{ width: 512, bgcolor: 'background.paper', borderRadius: 2, float:'left', marginTop: 4  }}>
            <Stack direction="row" alignItems="center">
              <IconButton className="medium_button" color="light" onClick={handleCancel}>
                <TungstenSharpIcon className="medium_button"/>
              </IconButton>
              <Autocomplete
                freeSolo
                sx={{
                  width:'80%'
                }}
                color="light"
                disableClearable
                value={lightModel ? lightModel.name : ''}
                options={allLights.map((option) => option.name)}
                onChange={(event) => setLightModel(allLights[event.target.value])}
                renderInput={(params) => (
                  <TextField
                    color="light"
                    variant="standard"
                    {...params}
                    label="Light"
                    InputProps={{
                      ...params.InputProps,
                      type: 'search',
                    }}
                  />
                )}
              />
              <ButtonGroup sx = {{ float:'right'}}>
                <IconButton className="medium_button" color="info">
                  <CloseSharpIcon className="medium_button"/>
                  {lightCount? lightCount : 1}
                </IconButton>
              </ButtonGroup>
            </Stack>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default NewSystemForm;


