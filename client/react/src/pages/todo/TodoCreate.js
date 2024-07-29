import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import { FormTextInput, TextAreaInput, FormButton, DateSelector } from '../../elements/Form';
import dayjs from 'dayjs';
import { useTodos } from '../../hooks/useTodos';

const TodoCreate = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueOn, setDueOn] = useState(dayjs());
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { createTodo } = useTodos();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      await createTodo({ name, description, due_on: dueOn.toISOString() });
      navigate("/");
    } catch (err) {
      setError("Failed to create todo. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/");
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
            <FormTextInput
              label="Title"
              value={name}
              color="type"
              setValue={setName}
            />
            <TextAreaInput
              label="Description"
              value={description}
              color="lime"
              setValue={setDescription}
            />
            <DateSelector
              label="Due"
              value={dueOn}
              setValue={setDueOn}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        </form>
      </Box>
    </Box>
  );
};

export default TodoCreate;