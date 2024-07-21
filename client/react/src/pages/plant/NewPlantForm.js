import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import {useNavigate} from "react-router-dom" 
import { AutoCompleteInput, DropdownInput, FormButton, NumberInput } from '../../elements/Form';

// Creating Plant Form
const NewPlantForm = () => {
  const phases = ["cutting", "seed", "juvy", "adult"]

  // Form Fields
  const [name, setName] = useState('');
  const [genus, setGenus] = useState(null);
  const [type, setType] = useState(null);
  const [system, setSystem] = useState(null);
  const [size, setSize] = useState(0);
  const [cost, setCost] = useState(0);
  const [watering, setWatering] = useState(0);
  const [phase, setPhase] = useState("adult");

  // Field Populators
  const [allTypes, setAllTypes] = useState([]);
  const [allGenuses, setAllGenuses] = useState([]);
  const [genusChange, setGenusChanged] = useState(false);
  const [allSystems, setAllSystems] = useState([]);

  // Submitted state
  const [submitted, setSubmitted] = useState(false);

  // Navigation
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch plant data from the server
    fetch('http://127.0.0.1:5000/genus')
      .then((response) => response.json())
      .then((data) => setAllGenuses(data))
      .catch((error) => console.error('Error fetching all genuses data:', error));
    if (genus && genusChange) {
      setGenusChanged(false);
      fetch('http://127.0.0.1:5000/type')
        .then((response) => response.json())
        .then((data) => setAllTypes(data))
        .catch((error) => console.error('Error fetching all types data:', error));
    }
    fetch('http://127.0.0.1:5000/system')
      .then((response) => response.json())
      .then((data) => setAllSystems(data))
      .catch((error) => console.error('Error fetching all system data:', error));
  
  }, [genus, genusChange]);

  useEffect(() => {
    if (submitted) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({name: name, size: size, cost: cost, genus_id: genus.id, system_id: system.id, type_id: type.id, watering: watering, phase: phase })
      };
      fetch('http://127.0.0.1:5000/plants', requestOptions)
        .then(response => response.json())
        .then(data => {
          // handle the response data if needed
          // maybe update some state based on the response
          console.log(data);
        })
        .catch(error => console.error('Error posting plant data:', error));
      clearForm();
      navigate("/");
    }
  }, [submitted, name, size, cost, genus, type, system, watering, phase]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true); // Update submitted state
  };

  const handleCancel = () => {
    clearForm();
    navigate("/create");
  };

  const clearForm = () => {
    setName('');
    setCost(0);
    setSize(0);
    setPhase('');
    setWatering(0);
    setGenus(null);
    setType(null);
    setSystem(null);
    setSubmitted(false);
  };

  const genusAlter = (value) => {
    setGenusChanged(true);
    setGenus(allGenuses[value]);
  };

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
              setValue={genusAlter}
              options={allGenuses}
              color="primary"
            />
            <AutoCompleteInput
              label="Type"
              value={type}
              setValue={setType}
              options={allTypes}
              color="primary"
            />
            <AutoCompleteInput
              label="System"
              value={system}
              setValue={setSystem}
              options={allSystems}
              color="primary"
            />
            <DropdownInput
              label="Phase"
              value={phase}
              options={phases}
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

export default NewPlantForm;
