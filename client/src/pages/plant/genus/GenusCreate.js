import React, { useState } from 'react';
import Box from '@mui/material/Box';
import {useNavigate} from "react-router-dom" 
import { FormTextInput, NumberInput, FormButton} from '../../../elements/Form';
import { useGenuses } from '../../../hooks/usePlants';
import { ServerError } from '../../../elements/Page';

/** Create a genus. Ideally not really used. */
const GenusCreate = () => {
  // Form Fields
  const [name, setName] = useState('');
  const [watering, setWatering] = useState(0);
  
  const { error, createGenus} = useGenuses();

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newGenus = {
      name,
      watering
    };

    try {
      await createGenus(newGenus);
      navigate("/");
    } catch (error) {
      console.error('Error adding new genus:', error);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (error) return <ServerError/>;

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

export default GenusCreate;
