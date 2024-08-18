import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import { FormTextInput, TextAreaInput } from '../../elements/Form';
import { useMixes, useSoils } from '../../hooks/useMix';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import IconFactory from '../../elements/IconFactory';
import ButtonGroup from '@mui/material/ButtonGroup';
import Autocomplete from '@mui/material/Autocomplete';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import RemoveSharpIcon from '@mui/icons-material/RemoveSharp';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';

const MixCreate = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [experimental, setExperimental] = useState('');
  const [soilsByParts, setSoilsByParts] = useState([{"soil": "", "parts": 1}]);

  const navigate = useNavigate();
  const { error, createMix , setError} = useMixes();
  const { soils } = useSoils();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      let soils_json = {};
      soilsByParts.forEach((soilByPart) => {
        soils_json[soilByPart["soil"]["id"]] = soilByPart["parts"];
      });
      setExperimental(false);
      await createMix({ name, description, experimental, soils: soils_json });
      navigate("/");
    } catch (err) {
      setError("Failed to create mix. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  const createSoildByPart = () => {
    setSoilsByParts(prevSoilsByParts => {
      return [
        ...prevSoilsByParts,
        { soil: null, parts: 1 }  // Default to 1 part, null soil
      ];
    });
  };

  const updateSoilByPartsCount = (index, delta) => {
    setSoilsByParts(prevSoilsByParts => {
      const newSoilsByParts = [...prevSoilsByParts];
      const newParts = (newSoilsByParts[index].parts || 0) + delta;
      if (newParts > 0) {
        newSoilsByParts[index] = {
          ...newSoilsByParts[index],
          parts: newParts
        };
        return newSoilsByParts;
      }
      return prevSoilsByParts;
    });
  };

  const updateSoilByParts = (index, soilByPart) => {
    setSoilsByParts(prevSoilsByParts => {
      const newSoilsByParts = [...prevSoilsByParts];
      if (index === newSoilsByParts.length) {
        return [...newSoilsByParts, soilByPart];
      } else {
        newSoilsByParts[index] = {
          ...newSoilsByParts[index],
          soil: soilByPart.soil,
          parts: soilByPart.parts
        };
        return newSoilsByParts;
      }
    });
  };

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ width: 800, height: 312, borderRadius: 2 }} display="flex">
        <form onSubmit={handleSubmit}>
          <Box sx={{ width: 512, height: 312, borderRadius: 2, float:'left', paddingRight: 2, paddingLeft: 4  }}>
            <div className='left'>
              <div class="pieContainer">
                <div class="pieBackground"></div>
                <div id="pieSlice1" class="hold"><div class="pie"></div></div>
                <div id="pieSlice2" class="hold"><div class="pie"></div></div>
                <div id="pieSlice3" class="hold"><div class="pie"></div></div>
                <div id="pieSlice4" class="hold"><div class="pie"></div></div>
                <div id="pieSlice5" class="hold"><div class="pie"></div></div>
                <div id="pieSlice6" class="hold"><div class="pie"></div></div>
                <div class="innerCircle"><div class="content"><b>Data</b><br></br>from 16<sup>th</sup> April, 2014</div></div>
              </div>
              <ButtonGroup>
                <IconButton className="left_button" type="submit" color="info">
                  <IconFactory
                      icon={"check"}
                      size={"xlg"}
                  >
                  </IconFactory>
                </IconButton>
                <IconButton className="left_button" color="error" onClick={handleCancel}>
                  <IconFactory
                      icon={"close"}
                      size={"xlg"}
                  >
                  </IconFactory>
                </IconButton>
              </ButtonGroup>
            </div>
            <div className='right'>
              <FormTextInput
                label="Title"
                value={name}
                color="type"
                setValue={setName}
              />
              <TextAreaInput
                label="Description"
                value={description}
                color="lime"
                setValue={setDescription}
              />
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
          </Box>
          <Box sx={{ width: 256, height: 312, borderRadius: 2, float:'right', paddingRight: 2, marginLeft: 4  }}>
          <List>
              {soilsByParts.map((soilByPart, index) => {
                return (
                  <Stack key={index} direction="row" alignItems="center">
                    <Autocomplete
                      freeSolo
                      sx={{
                        width:'80%'
                      }}
                      color="primary"
                      disableClearable
                      value={soilByPart.soil ? soilByPart.soil.name : ''}
                      options={soils.map((option) => option.name)}
                      onChange={(event, newValue) => {
                        const selectedSoil = soils.find(soil => soil.name === newValue);
                        updateSoilByParts(index, {
                          ...soilByPart,
                          soil: selectedSoil
                        });
                      }}
                      renderInput={(params) => (
                      <TextField
                        variant="standard"
                        {...params}
                        label="Soil Type"
                        InputProps={{
                        ...params.InputProps,
                        type: 'search',
                      }}
                  />
                  )}
                  />
                  <ButtonGroup sx = {{ float:'right'}}>
                    <IconButton color='primary' onClick={() => updateSoilByPartsCount(index, -1)}>
                      <RemoveSharpIcon/>
                    </IconButton>
                      <p>{soilByPart.parts}</p>
                    <IconButton color='primary' onClick={() => updateSoilByPartsCount(index, 1)}>
                      <AddSharpIcon/>
                    </IconButton>
                  </ButtonGroup>
                </Stack>
              )})}
              </List>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
              <IconButton 
                onClick={() => createSoildByPart()}>
                <IconFactory 
                  icon={"create"}
                  size="md"/>
              </IconButton>
              </Box>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default MixCreate;