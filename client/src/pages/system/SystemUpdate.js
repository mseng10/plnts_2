import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import { FormButton, FormTextInput, TextAreaInput, SliderInput } from '../../elements/Form';
import { useSystems, humidityMarks, temperatureMarks, durationMarks, distanceMarks } from '../../hooks/useSystems';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';
import ButtonGroup from '@mui/material/ButtonGroup';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import TungstenSharpIcon from '@mui/icons-material/TungstenSharp';
import TextField from '@mui/material/TextField';

const SystemUpdate = ({ systemProp }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { systems, isLoading, error, updateSystem } = useSystems();

  // Form Fields
  const [humidity, setHumidity] = useState(60);
  const [temperature, setTempurature] = useState(68);
  const [duration, setDuration] = useState(12);
  const [distance, setDistance] = useState(24);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [lightModel, setLightModel] = useState(null);
  const [allLights, setAllLights] = useState([]); 
  const [lightCount, setLightCount] = useState(1);

  useEffect(() => {
    const initializeForm = (system) => {
      if (system) {
        setName(system.name);
        setDescription(system.description);
        setHumidity(system.humidity);
        setTempurature(system.temperature);
        setDuration(system.duration);
        setDistance(system.distance);
        // TODO: Sync light data
        setLightModel(null);
        setLightCount(1);
        setAllLights([]);
      }
    };

    if (systemProp) {
      initializeForm(systemProp);
    } else if (systems.length > 0 && id) {
      const system = systems.find(_t => _t.id === parseInt(id));
      if (system) {
        initializeForm(system);
      }
    }
  }, [systemProp, systems, id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const light = lightModel;
    const updatedSystem = {
      name,
      description,
      humidity,
      temperature,
      duration,
      distance,
      light
    };
    try {
      await updateSystem(systemProp ? systemProp.id : id, updatedSystem);
      navigate("/system/view");
    } catch (error) {
      console.error('Error updating system:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleCancel = () => {
    navigate("/system/view");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box sx={{ height: '100%', width: '100%'}}>
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
                <IconButton className="medium_button" color="primary">
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

export default SystemUpdate;