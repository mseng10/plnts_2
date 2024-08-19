import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import { AutoCompleteInput, DropdownInput, FormButton, NumberInput } from '../../elements/Form';
import { usePlants } from '../../hooks/usePlants';
import { PHASE_LABELS } from '../../constants';
import { ServerError } from '../../elements/Page';

const PlantUpdate = ({ plantProp }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { plants, genuses, systems, types, isLoading, error, updatePlant } = usePlants();

  const [genus, setGenus] = useState(null);
  const [type, setType] = useState(null);
  const [system, setSystem] = useState(null);
  const [size, setSize] = useState(0);
  const [cost, setCost] = useState(0);
  const [watering, setWatering] = useState(0);
  const [phase, setPhase] = useState("adult");

  useEffect(() => {
    const initializeForm = (plant) => {
      if (plant) {
        setGenus(genuses.find(_g => _g.id === plant.genus_id));
        setType(types.find(_t => _t.id === plant.type_id));
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
      const plant = plants.find(_p => _p.id === parseInt(id));
      if (plant) {
        initializeForm(plant);
      }
    }
  }, [plantProp, plants, id, genuses, types, systems]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedPlant = {
      size,
      cost,
      genus_id: genus.id,
      system_id: system.id,
      type_id: type.id,
      watering,
      phase
    };
    try {
      await updatePlant(plantProp ? plantProp.id : id, updatedPlant);
      navigate("/");
    } catch (error) {
      console.error('Error updating plant:', error);
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