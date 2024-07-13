import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import CheckSharpIcon from '@mui/icons-material/CheckSharp';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
// import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

/** Create a new todo to accomplish. */
const NewTodoForm = ({ isOpen, onRequestClose }) => {
  // Fields
  const [description, setDescription] = useState('');
  //   const [dueOn, setDueOn] = useState(null);

  // Submitted state
  const [submitted, setSubmitted] = useState(false); // Initialize submitted state

  useEffect(() => {
    if (submitted) {
      console.log("hELLO");
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: description })
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
      onRequestClose();
    }
  }, [submitted, description, onRequestClose]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true); // Update submitted state
  };

  const handleCancel = () => {
    clearForm();
    onRequestClose();
  };

  const clearForm = () => {
    setDescription('');
    setSubmitted(false);
  };

  return (
    <Modal
      open={isOpen}
      onClose={onRequestClose}
      aria-labelledby="new-bobby-form"
      disableAutoFocus={true}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'inherit',
        border: 'none',
      }}
    >
      <Box sx={{ width: 560, bgcolor: 'background.paper', borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <div className='left'>
            <FormatListNumberedIcon color='lime' className={'home_icon_form'}/>
            <ButtonGroup>
              <IconButton className="left_button" type="submit" color="primary">
                <CheckSharpIcon className="left_button"/>
              </IconButton>
              <IconButton className="left_button" color="error" onClick={handleCancel}>
                <CloseSharpIcon className="left_button"/>
              </IconButton>
            </ButtonGroup>
          </div>
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
            <TextField
              margin="normal"
              multiline
              rows={6}
              fullWidth
              required
              label="Description"
              value={description}
              variant="standard"
              color="lime"
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default NewTodoForm;


