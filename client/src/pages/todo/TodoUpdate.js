import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import { FormButton, FormTextInput, DateSelector, TextAreaInput } from '../../elements/Form';
import { useTodos } from '../../hooks/useTodos';
import dayjs from 'dayjs';
import { ServerError } from '../../elements/Page';
import Stack from '@mui/material/Stack';
import IconFactory from '../../elements/IconFactory';
import ButtonGroup from '@mui/material/ButtonGroup';
import RemoveSharpIcon from '@mui/icons-material/RemoveSharp';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';

const TodoUpdate = ({ todoProp }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { todos, isLoading, error, updateTodo } = useTodos();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueOn, setDueOn] = useState(dayjs());
  const [tasks, setTasks] = useState([]);


  useEffect(() => {
    const initializeForm = (todo) => {
      if (todo) {
        setName(todo.name);
        setDescription(todo.description);
        setDueOn(dayjs(todo.due_on));
        setTasks(todo.tasks)
      }
    
    };

    if (todoProp) {
      initializeForm(todoProp);
    } else if (todos.length > 0 && id) {
      const todo = todos.find(_t => _t.id === id);
      if (todo) {
        initializeForm(todo);
      }
    }
  }, [todoProp, todos, id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const due_on = dueOn.toISOString()
    const updatedTodo = {
      id,
      name,
      description,
      due_on
    };
    try {
      await updateTodo(updatedTodo);
      navigate("/");
    } catch (error) {
      console.error('Error updating todo:', error);
      // You might want to show an error message to the user here
    }
  };

  const addTask = () => {
    setTasks(prevTasks => {
      return [
        ...prevTasks,
        { description: "" }
      ];
    });
  };


  const removeTask = () => {
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

  const handleCancel = () => {
    navigate("/todos");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <ServerError/>;

  return (
    <Box sx={{ height: '100%', width: '100%'}}>
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

export default TodoUpdate;