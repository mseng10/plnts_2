import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { useNavigate } from "react-router-dom";
import { AutoCompleteInput, DropdownInput, FormButton, NumberInput } from '../../elements/Form';
import { usePlants, useSpecies } from '../../hooks/usePlants';
import { PHASE_LABELS } from '../../constants';
import { useMixes } from '../../hooks/useMix';
import { ServerError, Loading } from '../../elements/Page';

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newPlant = {
      size,
      cost,
      species_id: selectedSpecies.id,
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
    <Box sx={{ height: '100%', width: '100%'}}>
      <Box sx={{ width: 600 }}>
        <form onSubmit={handleSubmit}>
          <FormButton
            icon="plant"
            color="primary"
            handleCancel={handleCancel}
          />
          <div className='right'>
            <AutoCompleteInput
              label="Species"
              value={selectedSpecies}
              setValue={setSelectedSpecies}
              options={species}
              color="primary"
            />
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
            <NumberInput
              label="Size"
              value={size}
              color="primary"
              setValue={setSize}
            />
            <NumberInput
              label="Cost"
              value={cost}
              color="primary"
              setValue={setCost}
            />
            <NumberInput
              label="Watering"
              value={watering}
              color="primary"
              setValue={setWatering}
            />
          </div>
        </form>
      </Box>
    </Box>
  );
};

export default PlantCreate;