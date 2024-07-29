import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import {useNavigate} from "react-router-dom" 
import { FormTextInput, NumberInput, FormButton} from '../../../elements/Form';

/** Create a genus. Ideally not really used. */
const NewGenusForm = () => {
  // Form Fields
  const [name, setName] = useState('');
  const [watering, setWatering] = useState(0);
  
  // Submitted state
  const [submitted, setSubmitted] = useState(false);

  // Navigation
  const navigate = useNavigate();

  useEffect(() => {
    if (submitted) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, watering: watering })
      };
      fetch('http://127.0.0.1:5000/genus', requestOptions)
        .then(response => response.json())
        .then(data => {
          // handle the response data if needed
          // maybe update some state based on the response
          console.log(data);
        })
        .catch(error => console.error('Error posting genus data:', error));
      handleCancel();
      navigate("/");
    }
  }, [submitted, name, watering]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true); // Update submitted state
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ width: 512, bgcolor: 'background.paper', borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <FormButton
            icon="genus"
            color="genus"
            handleCancel={handleCancel}
          ></FormButton>
          <div className='right'>
            <FormTextInput
              label={"Name"}
              value={name}
              color={"genus"}
              setValue={setName}
            >
            </FormTextInput>
            <NumberInput
              label={"Watering (days)"}
              value={watering}
              color={"genus"}
              setValue={setWatering}
            ></NumberInput>
          </div>
        </form>
      </Box>
    </Box>
  );
};

export default NewGenusForm;
