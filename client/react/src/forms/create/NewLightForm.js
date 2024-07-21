import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import {useNavigate} from "react-router-dom" 
import { FormTextInput, NumberInput, AutoCompleteInput, FormButton } from '../../elements/Form';

// Form to create a light that is potentially used on a system.
const NewLightForm = ({ systems }) => {

  // Fields
  const [name, setName] = useState('');
  const [system, setSystem] = useState(null);
  const [cost, setCost] = useState(0);

  // Submitted state
  const [submitted, setSubmitted] = useState(false);

  // Navigation
  const navigate = useNavigate();

  // Available systems
  const [allSystems, setAllSystems] = useState([]);
  useEffect(() => {
    if (!systems) {
      fetch('http://127.0.0.1:5000/system')
        .then((response) => response.json())
        .then((data) => setAllSystems(data))
        .catch((error) => console.error('Error fetching all system data:', error));
    }
  }, [systems]);

  // POST
  useEffect(() => {
    if (submitted) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({name: name, cost: cost, system_id: system.id })
      };
      fetch('http://127.0.0.1:5000/light', requestOptions)
        .then(response => response.json())
        .then(data => {
          // handle the response data if needed
          // maybe update some state based on the response
          console.log(data);
        })
        .catch(error => console.error('Error posting plants data:', error));
      clearForm();
      navigate("/");
    }
  }, [submitted, name, cost, system]);

  // Initiate POST
  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true); // Update submitted state
  };

  // Exit
  const handleCancel = () => {
    clearForm();
    navigate("/create");
  };

  // Clear Form Fields
  const clearForm = () => {
    setName('');
    setCost(0);
    setSystem(null);
    setSubmitted(false);
  };

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ width: 600, bgcolor: 'background.paper', borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <FormButton
            icon="light"
            color="light"
            handleCancel={handleCancel}
          />
          <div className='right'>
            <FormTextInput
              label="Name"
              value={name}
              color="light"
              setValue={setName}
            ></FormTextInput>
            <AutoCompleteInput
              label="System"
              color="light"
              value={system}
              options={allSystems}
              setValue={setSystem}
            >
            </AutoCompleteInput>
            <NumberInput
              label="Cost"
              value={cost}
              color="light"
              setValue={setCost}
            />
          </div>
        </form>
      </Box>
    </Box>
  );
};

export default NewLightForm;
