import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import Stack from '@mui/material/Stack';
import TungstenSharpIcon from '@mui/icons-material/TungstenSharp';
import Autocomplete from '@mui/material/Autocomplete';
import {useNavigate} from "react-router-dom" 
import { SliderInput, TextAreaInput, FormTextInput, FormButton } from '../../elements/Form';
import { temperatureMarks, humidityMarks, durationMarks, distanceMarks } from '../../hooks/useSystems';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import RemoveSharpIcon from '@mui/icons-material/RemoveSharp';

/** Create a system that houses plants */
const NewSystemForm = ({ systems }) => {
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

  // Navigation
  const navigate = useNavigate();

  useEffect(() => {
    if (!allSystems) {
      setLightCount(1);
      fetch('http://127.0.0.1:5000/system')
        .then((response) => response.json())
        .then((data) => setAllSystems(data))
        .catch((error) => console.error('Error fetching genus data:', error));
      fetch('http://127.0.0.1:5000/light')
        .then((response) => response.json())
        .then((data) => setAllLights(data))
        .catch((error) => console.error('Error fetching lights data:', error));
    }
  }, [allSystems]);

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
      navigate("/")
    }
  }, [submitted, name, description, temperature, humidity, distance, duration,lightModel, lightCount ]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true); // Update submitted state
  };

  const updateLightCount = (increment) => {
    let newCount = lightCount;
    newCount+=increment;
    if (newCount > 0) {
      setLightCount(newCount);
    }
  };

  const handleCancel = () => {
    navigate("/create");
  };

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ width: 800, height: 312, borderRadius: 2 }} display="flex">
        <form onSubmit={handleSubmit}>
          <Box sx={{ width: 512, height: 312, borderRadius: 2, float:'left', paddingRight: 2, paddingLeft: 4  }}>
            <FormButton
              icon="system"
              color="primary"
              handleCancel={handleCancel}
            />
            <div className='right'>
              <FormTextInput
                label="Name"
                value={name}
                color="primary"
                setValue={setName}
              />
              <TextAreaInput
                label="Description"
                value={description}
                color="primary"
                setValue={setDescription}
              />
            </div>
          </Box>
          <Box sx={{ width: 256, height: 312, borderRadius: 2, float:'right', paddingRight: 2, marginLeft: 4  }}>
            <SliderInput
              icon="humidity"
              label={"Humidity"}
              value={humidity}
              setValue={setHumidity}
              defaultValue={12}
              step={1}
              marks={humidityMarks}
              min={0}
              max={100}
            />
            <SliderInput
              icon="temperature"
              label={"Temperature"}
              value={temperature}
              setValue={setTempurature}
              marks={temperatureMarks}
              step={2}
              min={48}
              max={80}
            />
            <SliderInput
              icon="duration"
              label={"Duration"}
              value={duration}
              setValue={setDuration}
              marks={durationMarks}
              min={6}
              max={18}
              step={1}
            />
            <SliderInput
              icon="distance"
              label={"Distance"}
              value={distance}
              setValue={setDistance}
              step={2}
              marks={distanceMarks}
              min={12}
              max={36}
            />
          </Box>
          <Box sx={{ width: 800, float:'left', marginTop: 4  }}>
            <Stack direction="row" alignItems="center">
              <IconButton color="primary" onClick={handleCancel}>
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
                <IconButton color='primary' onClick={() => updateLightCount(-1)}>
                  <RemoveSharpIcon/>
                </IconButton>
                <p>{lightCount}</p>
                <IconButton color='primary' onClick={() => updateLightCount(1)}>
                  <AddSharpIcon/>
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


