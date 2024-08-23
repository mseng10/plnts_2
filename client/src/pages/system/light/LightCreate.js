import React, { useState } from 'react';
import Box from '@mui/material/Box';
import {useNavigate} from "react-router-dom" 
import { FormTextInput, NumberInput, AutoCompleteInput, FormButton } from '../../../elements/Form';
import { useSystems, useLights } from '../../../hooks/useSystems';
import { Loading, ServerError } from '../../../elements/Page';

// Form to create a light that is potentially used on a system.
const NewLightForm = () => {

  // Fields
  const [name, setName] = useState('');
  const [system, setSystem] = useState(null);
  const [cost, setCost] = useState(0);

  const { systems, isLoading, error } = useSystems();
  const { createLight } = useLights();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createLight({
        name,
        cost,
        system_id: system.id
      });
      navigate("/");
    } catch (error) {
      console.error('Error adding new light:', error);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (isLoading) return <Loading/>;
  if (error) return <ServerError/>;

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
              options={systems}
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
