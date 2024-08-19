import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { useNavigate } from "react-router-dom";
import { AutoCompleteInput, DropdownInput, FormButton, NumberInput } from '../../elements/Form';
import { usePlants } from '../../hooks/usePlants';
import { PHASE_LABELS } from '../../constants';
import { useMixes } from '../../hooks/useMix';
import { ServerError } from '../../elements/Page';

const PlantCreate = () => {
  const navigate = useNavigate();
  const { genuses, systems, types, isLoading, error, addPlant } = usePlants();
  const { mixes } = useMixes(true);

  const [genus, setGenus] = useState(null);
  const [type, setType] = useState(null);
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
      genus_id: genus.id,
      system_id: system.id,
      type_id: type.id,
      mix_id: mix.id,
      watering,
      phase
    };

    try {
      await addPlant(newPlant);
      navigate("/");
    } catch (error) {
      console.error('Error adding new plant:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (isLoading) return <div>Loading...</div>;
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
              label="Genus"
              value={genus}
              setValue={setGenus}
              options={genuses}
              color="primary"
            />
            <AutoCompleteInput
              label="Type"
              value={type}
              setValue={setType}
              options={types}
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