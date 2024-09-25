import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import Box from '@mui/material/Box';
import {DynamicForm, FormTextInput } from '../../elements/Form';
import { useTodos } from '../../hooks/useTodos';
import { List, Stack, ButtonGroup, IconButton } from '@mui/material';
import RemoveSharpIcon from '@mui/icons-material/RemoveSharp';
import IconFactory from '../../elements/IconFactory';
import { PANEL_TYPES } from '../../constants';
import dayjs from 'dayjs';
import { APIS, simpleFetch, apiBuilder } from '../../api';

const Tasks = ({value, onChange}) => {
  const removeTask = (index) => {
    onChange(prevTasks => {
      prevTasks.filter((task, ind) => ind !== index)
    });
  };

  const addTask = () => {
    const newValues = value;
    newValues.push({ description: "" })

    onChange(newValues);
  };

  const updateTask = (description, index) => {
    if (value.length == 0) {
      onChange([]);
    } else {
      onChange(prevTasks => prevTasks.map((task, _i) => 
        _i === index ? { ...task, description: description } : task
      ));
    }
  };

  return (
    <div>
    <List>
      {value && value.map((task, index) => {
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
    </div>
  );
};

const TodoForm = () => {
  const [model, setModel] = useState(null);
  const { id } = useParams();
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { createTodo, updateTodo } = useTodos();

  const handleSubmit = async (formattedData) => {
    setError(null);
    try {
      if (id) {
        formattedData[id] = id;
        await updateTodo(formattedData);
      } else {
        await createTodo(formattedData);
      }
      navigate("/");
    } catch (err) {
      setError("Failed to create todo. Please try again.");
    }
  };

  useEffect(() => {
    if (id) {
      // Fetch the model data if we're editing an existing entry
      // This is where you'd typically make an API call
      simpleFetch(apiBuilder(APIS.todo.getOne).setId(id).get())
        .then(setModel)
        .catch(error => {
          setError(error);
        })
    } else {
      // If there's no ID, we're creating a new entry, so set an empty model
      setModel({});
    }
  }, [id]);

  const handleCancel = () => {
    if (id) {
      navigate("/todos");
    } else {
      navigate("/");
    }
  };

  const sections = [
    {
      icon: "todo",
      size: PANEL_TYPES.medium,
      fields: [
        { name: "name", label: "Name", type: "input", required: true },
        { name: "description", label: "Description", type: "text" },
        { name: "due_on", label: "Due", type: "date", export: (value) => value.toISOString(),import:(value) => dayjs(value),default: dayjs()}
      ]
    },
    {
      size: PANEL_TYPES.small,
      fields: [
        { name: "tasks", label: "Tasks", type: "input", default: [], component: Tasks}
      ]
    }
  ]


  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ width: 800, height: 312, borderRadius: 2 }} display="flex">
        <DynamicForm sections={sections} onSubmit={handleSubmit} onCancel={handleCancel} model={model}/>
        {error}
      </Box>
    </Box>
  );
};

export default TodoForm;