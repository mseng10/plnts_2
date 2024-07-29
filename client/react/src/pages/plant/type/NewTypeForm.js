import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import {useNavigate} from "react-router-dom" 
import { FormButton, FormTextInput, AutoCompleteInput, TextAreaInput } from '../../../elements/Form';

/** Create a new plant type of a specified genus. */
const NewTypeForm = () => {
  // Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [genus, setGenus] = useState(null);

  // Field Populators
  const [allGenuses, setAllGenuses] = useState([]);

  // Submitted state
  const [submitted, setSubmitted] = useState(false); // Initialize submitted state

  // Navigation
  const navigate = useNavigate();

  useEffect(() => {
    if (allGenuses.length == 0) {
      fetch('http://127.0.0.1:5000/genus')
        .then((response) => response.json())
        .then((data) => setAllGenuses(data))
        .catch((error) => console.error('Error fetching genus data:', error));
    }
  }, [allGenuses]);

  useEffect(() => {
    if (submitted && genus) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, description: description, genus_id: genus.id })
      };
      fetch('http://127.0.0.1:5000/type', requestOptions)
        .then(response => response.json())
        .then(data => {
          // handle the response data if needed
          // maybe update some state based on the response
          console.log(data);
          navigate("/");
        })
        .catch(error => console.error('Error posting type data:', error));
    }
  }, [submitted, name, description, genus]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true); // Update submitted state
  };

  const handleCancel = () => {
    navigate("/");
  };

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
              options={allGenuses}
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

export default NewTypeForm;


