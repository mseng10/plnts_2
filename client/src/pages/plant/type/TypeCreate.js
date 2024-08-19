import React, { useState } from 'react';
import Box from '@mui/material/Box';
import {useNavigate} from "react-router-dom" 
import { FormButton, FormTextInput, AutoCompleteInput, TextAreaInput } from '../../../elements/Form';
import { useTypes, useGenuses } from '../../../hooks/usePlants';
import { ServerError } from '../../../elements/Page';

/** Create a new plant type of a specified genus. */
const TypeCreate = () => {
  // Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [genus, setGenus] = useState(null);

  const { createType } = useTypes();
  const { error, genuses} = useGenuses();

  // Navigation
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newType = {
      name,
      description,
      genus_id: genus.id
    };

    try {
      await createType(newType);
      navigate("/");
    } catch (error) {
      console.error('Error adding new type:', error);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (error) return <ServerError/>;
  
  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ width: 600, bgcolor: 'background.paper', borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <FormButton
            icon="type"
            color="type"
            handleCancel={handleCancel}
          />
          <div className='right'>
            <FormTextInput
              label={"Name"}
              value={name}
              color={"type"}
              setValue={setName}
            />
            <AutoCompleteInput
              label="Genus"
              color="type"
              value={genus}
              options={genuses}
              setValue={setGenus}
            />
            <TextAreaInput
              label="Description"
              value={description}
              color="type"
              setValue={setDescription}
            />
          </div>
        </form>
      </Box>
    </Box>
  );
};

export default TypeCreate;


