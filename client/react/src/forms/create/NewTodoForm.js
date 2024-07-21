import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
// import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import {useNavigate} from "react-router-dom" 
import { FormTextInput, TextAreaInput, FormButton } from '../../elements/Form';
 

/** Create a new todo to accomplish. */
const NewTodoForm = () => {
  // Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  //   const [dueOn, setDueOn] = useState(null);

  // Navigation
  const navigate = useNavigate();

  // Submitted state
  const [submitted, setSubmitted] = useState(false); // Initialize submitted state

  useEffect(() => {
    if (submitted) {
      console.log("hELLO");
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: description, name: name })
      };
      fetch('http://127.0.0.1:5000/todo', requestOptions)
        .then(response => response.json())
        .then(data => {
          // handle the response data if needed
          // maybe update some state based on the response
          console.log(data);
        })
        .catch(error => console.error('Error posting todo data:', error));
      clearForm();
      navigate("/");
    }
  }, [submitted, description]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true); // Update submitted state
  };

  const handleCancel = () => {
    clearForm();
    navigate("/create");
  };

  const clearForm = () => {
    setDescription('');
    setName('');
    setSubmitted(false);
  };

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ width: 600, bgcolor: 'background.paper', borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <FormButton
            icon="todo"
            color="lime"
            handleCancel={handleCancel}
          />
          <div className='right'>
            {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={value}
                onChange={(newValue) => {
                  setDueOn(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
               />
            </LocalizationProvider> */}
            <FormTextInput
              label={"Title"}
              value={name}
              color={"type"}
              setValue={setName}
            />
            <TextAreaInput
              label="Description"
              value={description}
              color="lime"
              setValue={setDescription}
            />
          </div>
        </form>
      </Box>
    </Box>
  );
};

export default NewTodoForm;


