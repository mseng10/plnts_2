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
  const [soilsByParts, setSoilsByParts] = useState([{"soil": "", "parts": 0}]);

  const navigate = useNavigate();
  const { error, createMix , setError} = useMixes();
  const { soils } = useSoils();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      let soils_json = soilsByParts.map();
      await createMix({ name, description, soils: soils_json });
      navigate("/");
    } catch (err) {
      setError("Failed to create mix. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  const createSoildByPart = () => {
    let soilByPart = {
        "soil": "",
        "parts": 0
    }
    let newIndex = soilsByParts.length;
    updateSoilByParts(newIndex, soilByPart);
  }

  const updateSoilByPartsCount = (index, delta) => {
    let soilByPart = soilsByParts[index];
    console.log(soilByPart)
    soilByPart.parts += delta;
    updateSoilByParts(index, soilByPart)
  };

  const updateSoilByParts = (index, soilByPart) => {
    let newSoilByParts = soilsByParts;
    if (index == newSoilByParts.length) {
        newSoilByParts.push(soilByPart);
    } else {
        newSoilByParts[index].soil = soilByPart.soil
        newSoilByParts[index].parts = soilByPart.parts
    }
    setSoilsByParts(newSoilByParts);
  };
  

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ width: 600, bgcolor: 'background.paper', borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
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
                    value={soilByPart ? soilByPart.soil : ''}
                    options={soils.map((option) => option.name)}
                    onChange={(event) => updateSoilByParts(soilsByParts.indexOf(soilByPart), {"soils": soils[event.target.value], "parts": soilByPart["parts"]})}
                    renderInput={(params) => (
                    <TextField
                      color="light"
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
            <IconButton 
              onClick={() => createSoildByPart()}>
              <IconFactory 
                icon={"create"}
                size="md"/>
            </IconButton>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        </form>
      </Box>
    </Box>
  );
};

export default MixCreate;