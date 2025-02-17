import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import Box from '@mui/material/Box';
import { FormTextInput, TextAreaInput } from '../../elements/Form';
import { useMixes, useSoils, useSoilParts } from '../../hooks/useMix';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import IconFactory from '../../elements/IconFactory';
import ButtonGroup from '@mui/material/ButtonGroup';
import Autocomplete from '@mui/material/Autocomplete';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import RemoveSharpIcon from '@mui/icons-material/RemoveSharp';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import { ServerError } from '../../elements/Page';

const MixUpdate = () => {
  const { id } = useParams();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [experimental, setExperimental] = useState(false);

  const navigate = useNavigate();
  const { mixes, error, updateMix , setError} = useMixes();
  const { soils } = useSoils();
  const {soilParts, setSoilParts} = useSoilParts();

  useEffect(() => {
    const initializeForm = (mix) => {
      if (mix) {
        setName(mix.name);
        setDescription(mix.description);
        let soil_parts = mix.soil_parts
        soil_parts.forEach((soilPart) => {
          soilPart.soil = soils.find(soil => soil.id === soilPart.soil_id);
        });
        setSoilParts(soil_parts)
      }
    };

    if (mixes.length > 0 && id) {
      const mix = mixes.find(_t => _t.id === id);
      if (mix) {
        initializeForm(mix);
      }
    }
  }, [mixes, soils, id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const soils_json = [];
      soilParts.forEach((soilPart) => {
        if (soilPart.soil !== "") {
          soils_json.push({
            soil_id: soilPart.soil.id,
            parts: soilPart.parts
          });
        }
      });
      setExperimental(false);
      await updateMix({ id: id, name, description, experimental, soil_parts: soils_json });
      navigate("/");
    } catch (err) {
      setError("Failed to create mix. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/mixes");
  };

  const createSoildByPart = () => {
    setSoilParts(prevSoilsByParts => {
      return [
        ...prevSoilsByParts,
        { soil: null, parts: 1 }  // Default to 1 part, null soil
      ];
    });
  };

  const updateSoilByPartsCount = (index, delta) => {
    setSoilParts(prevSoilsByParts => {
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
    setSoilParts(prevSoilsByParts => {
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
  // if (isLoading) return <Loading/>;
  if (error) return <ServerError/>;

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ width: 800, height: 312, borderRadius: 2 }} display="flex">
        <form onSubmit={handleSubmit}>
          <Box sx={{ width: 512, height: 312, borderRadius: 2, float:'left', paddingRight: 2, paddingLeft: 4  }}>
            <div className='left'>
              <div className="pieContainer">
                <div className="pieBackground"></div>
                <div id="pieSlice1" className="hold"><div className="pie"></div></div>
                <div id="pieSlice2" className="hold"><div className="pie"></div></div>
                <div id="pieSlice3" className="hold"><div className="pie"></div></div>
                <div id="pieSlice4" className="hold"><div className="pie"></div></div>
                <div id="pieSlice5" className="hold"><div className="pie"></div></div>
                <div id="pieSlice6" className="hold"><div className="pie"></div></div>
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
              {soilParts && soilParts.map((soilPart, index) => {
                return (
                  <Stack key={index} direction="row" alignItems="center">
                    <Autocomplete
                      freeSolo
                      sx={{
                        width:'80%'
                      }}
                      color="primary"
                      disableClearable
                      value={soilPart.soil ? soilPart.soil.name : ''}
                      options={soils.map((option) => option.name)}
                      onChange={(event, newValue) => {
                        const selectedSoil = soils.find(soil => soil.name === newValue);
                        updateSoilByParts(index, {
                          ...soilPart,
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
                      <p>{soilPart.parts}</p>
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

export default MixUpdate;