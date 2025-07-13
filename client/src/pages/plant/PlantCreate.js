import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
import { AutoCompleteInput, DropdownInput, FormButton, NumberInput } from '../../elements/Form';
import { usePlants, useSpecies } from '../../hooks/usePlants';
import { PHASE_LABELS } from '../../constants';
import { useMixes } from '../../hooks/useMix';
import { ServerError, Loading } from '../../elements/Page';
import SpeciesCreateCard from './species/SpeciesCreateCard';

const PlantCreate = () => {
  const navigate = useNavigate();
  const { systems, isLoading, error, createPlant } = usePlants();
  const { species } = useSpecies();
  const { mixes } = useMixes(true);

  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [system, setSystem] = useState(null);
  const [mix, setMix] = useState(null);
  const [size, setSize] = useState(0);
  const [cost, setCost] = useState(0);
  const [watering, setWatering] = useState(0);
  const [phase, setPhase] = useState(PHASE_LABELS.adult);
  const [showSpeciesCreate, setShowSpeciesCreate] = useState(false);

  const handleSpeciesCreated = (newSpecies) => {
    // The useSpecies hook should handle re-fetching.
    setSelectedSpecies(newSpecies);
    setShowSpeciesCreate(false);
  };

  const handleSpeciesCreateClose = () => {
    setShowSpeciesCreate(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newPlant = {
      size,
      cost,
      species_id: selectedSpecies ? selectedSpecies.id : null,
      system_id: system.id,
      mix_id: mix.id,
      watering,
      phase
    };

    try {
      await createPlant(newPlant);
      navigate("/");
    } catch (error) {
      console.error('Error adding new plant:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (isLoading) return <Loading/>;
  if (error) return <ServerError/>;

  return (
    <Box sx={{ height: '100%', p: 2, display: 'flex'
    }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4} sx={{ 
            p: 4,
            borderRadius: 4,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
          }}>
            <Grid item xs={4}>
              <FormButton
                icon="plant"
                color="primary"
                handleCancel={handleCancel}
              />
            </Grid>
            <Grid item xs={8}>
              <Stack spacing={2}>
                <Box sx={{ position: 'relative' }}>
                  <AutoCompleteInput
                    label="Species"
                    value={selectedSpecies}
                    setValue={setSelectedSpecies}
                    options={species}
                    color="primary"
                    sx={{ paddingRight: '48px' }}
                  />
                  <IconButton
                    onClick={() => setShowSpeciesCreate(true)}
                    color="primary"
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                <AutoCompleteInput
                  label="System"
                  value={system}
                  setValue={setSystem}
                  options={systems}
                  color="primary"
                />
                <AutoCompleteInput
                  label="Mix"
                  value={mix}
                  setValue={setMix}
                  options={mixes}
                  color="primary"
                />
                <DropdownInput
                  label="Phase"
                  value={phase}
                  options={Object.values(PHASE_LABELS)}
                  setValue={setPhase}
                  color="primary"
                />
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <NumberInput
                      label="Size"
                      value={size}
                      color="primary"
                      setValue={setSize}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <NumberInput
                      label="Cost"
                      value={cost}
                      color="primary"
                      setValue={setCost}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <NumberInput
                      label="Watering"
                      value={watering}
                      color="primary"
                      setValue={setWatering}
                    />
                  </Grid>
                </Grid>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Box>
      <Box sx={{
        width: showSpeciesCreate ? 350 : 0, // A bit wider to accommodate the new card
        marginLeft: showSpeciesCreate ? 2 : 0,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        transition: 'width 0.4s ease-in-out, margin-left 0.4s ease-in-out',
        overflow: 'hidden',
      }}>
        {showSpeciesCreate && (
          <SpeciesCreateCard
            onClose={handleSpeciesCreateClose}
            onSpeciesCreated={handleSpeciesCreated}
          />
        )}
      </Box>
    </Box>
  );
};

export default PlantCreate;