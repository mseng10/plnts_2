import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import { FormTextInput, TextAreaInput, FormButton, DateSelector } from '../../elements/Form';
import dayjs from 'dayjs';
import { useTodos } from '../../hooks/useTodos';
import { List, Stack, ButtonGroup, IconButton } from '@mui/material';
import RemoveSharpIcon from '@mui/icons-material/RemoveSharp';
import IconFactory from '../../elements/IconFactory';

const TodoCreate = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [dueOn, setDueOn] = useState(dayjs());
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { createTodo } = useTodos();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      await createTodo({ name, description, due_on: dueOn.toISOString(), tasks });
      navigate("/");
    } catch (err) {
      setError("Failed to create todo. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  const removeTask = (index) => {
    setTasks(prevTasks => {
      prevTasks.filter((task, ind) => ind !== index)
    });
  };

  const addTask = () => {
    setTasks(prevTasks => {
      return [
        ...prevTasks,
        { description: "" }
      ];
    });
  };

  const updateTask = (description, index) => {
    if (tasks.length == 0) {
      setTasks([]);
    } else {
      setTasks(prevTasks => prevTasks.map((task, _i) => 
        _i === index ? { ...task, description: description } : task
      ));
    }
  };


  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ width: 800, height: 312, borderRadius: 2 }} display="flex">
        <form onSubmit={handleSubmit}>
          <Box sx={{ width: 512, height: 312, borderRadius: 2, float:'left', paddingRight: 2, paddingLeft: 4  }}>
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
          </Box>
          <Box sx={{ width: 256, height: 312, borderRadius: 2, float:'right', paddingRight: 2, marginLeft: 4  }}>
          <List>
            {tasks && tasks.map((task, index) => {
              return (
                <Stack key={index} direction="row" alignItems="center">
                  <FormTextInput
                    label="Task"
                    value={task.description}
                    color="primary"
                    setValue={(value => updateTask(value, index))}
                />
                  <ButtonGroup sx = {{ float:'right'}}>
                    <IconButton color='error' onClick={() => removeTask(index)}>
                      <RemoveSharpIcon/>
                    </IconButton>
                  </ButtonGroup>
                </Stack>
              )})}
            </List>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
              <IconButton 
                onClick={() => addTask()}>
                <IconFactory 
                  icon={"create"}
                  size="md"/>
              </IconButton>
              </Box>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default TodoCreate;