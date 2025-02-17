import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import { AutoCompleteInput, DropdownInput, FormButton, NumberInput } from '../../elements/Form';
import { usePlants } from '../../hooks/usePlants';
import { PHASE_LABELS } from '../../constants';
import { ServerError, Loading } from '../../elements/Page';
import { useMixes } from '../../hooks/useMix';
import { useSpecies } from '../../hooks/usePlants';

const PlantUpdate = ({ plantProp }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { plants, systems, isLoading, error, updatePlant } = usePlants();

  // Associated Models
  const {mixes} = useMixes();
  const {species} = useSpecies();

  // Fields
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [mix, setMix] = useState(null);
  const [system, setSystem] = useState(null);
  const [size, setSize] = useState(0);
  const [cost, setCost] = useState(0);
  const [watering, setWatering] = useState(0);
  const [phase, setPhase] = useState("adult");

  useEffect(() => {
    const initializeForm = (plant) => {
      if (plant) {
        setMix(mixes.find(_m => _m.id === plant.mix_id));
        setSelectedSpecies(species.find(_s => _s.id === plant.species_id));
        setSystem(systems.find(_s => _s.id === plant.system_id));
        setSize(plant.size);
        setCost(plant.cost);
        setWatering(plant.watering);
        setPhase(plant.phase);
      }
    };

    if (plantProp) {
      initializeForm(plantProp);
    } else if (plants.length > 0 && id) {
      const plant = plants.find(_p => _p.id === id);
      if (plant) {
        initializeForm(plant);
      }
    }
  }, [plantProp, plants, id, species, mixes, systems]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedPlant = {
      id,
      size: parseInt(size),
      cost: parseInt(cost),
      mix_id: mix.id,
      system_id: system.id,
      species_id: selectedSpecies.id,
      watering: parseInt(watering),
      phase
    };
    console.log(updatedPlant)
    try {
      await updatePlant(updatedPlant);
      navigate("/plants");
    } catch (error) {
      console.error('Error updating plant:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleCancel = () => {
    navigate("/plants");
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
              label="Mix"
              value={mix}
              setValue={setMix}
              options={mixes}
              color="primary"
            />
            <AutoCompleteInput
              label="System"
              value={system}
              setValue={setSystem}
              options={systems}
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

export default PlantUpdate;