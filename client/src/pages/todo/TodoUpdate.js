import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import { FormButton, FormTextInput, DateSelector, TextAreaInput } from '../../elements/Form';
import { useTodos } from '../../hooks/useTodos';
import dayjs from 'dayjs';

const TodoUpdate = ({ todoProp }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { todos, isLoading, error, updateTodo } = useTodos();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueOn, setDueOn] = useState(dayjs());

  useEffect(() => {
    const initializeForm = (todo) => {
      if (todo) {
        setName(todo.name);
        setDescription(todo.description);
        setDueOn(dayjs(todo.due_on));
      }
    };

    if (todoProp) {
      initializeForm(todoProp);
    } else if (todos.length > 0 && id) {
      const todo = todos.find(_t => _t.id === parseInt(id));
      if (todo) {
        initializeForm(todo);
      }
    }
  }, [todoProp, todos, id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const due_on = dueOn.toISOString()
    const updatedTodo = {
      name,
      description,
      due_on
    };
    try {
      await updateTodo(todoProp ? todoProp.id : id, updatedTodo);
      navigate("/");
    } catch (error) {
      console.error('Error updating todo:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleCancel = () => {
    navigate("/todo");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box sx={{ height: '100%', width: '100%'}}>
      <Box sx={{ width: 600 }}>
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

export default TodoUpdate;