import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import { FormTextInput, DateSelector, TextAreaInput } from '../../elements/Form';
import { useTodos } from '../../hooks/useTodos';
import dayjs from 'dayjs';
import { ServerError, Loading } from '../../elements/Page';
import { Stack, Button, Paper, Grid, Typography, IconButton, List } from '@mui/material';
import IconFactory from '../../elements/IconFactory';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const TodoUpdate = ({ todoProp }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { todos, isLoading, error, updateTodo, setError } = useTodos();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [dueOn, setDueOn] = useState(dayjs());
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const initializeForm = (todo) => {
            if (todo) {
                setName(todo.name || '');
                setDescription(todo.description || '');
                setDueOn(dayjs(todo.due_on));
                setTasks(todo.tasks || []);
            }
        };

        if (todoProp) {
            initializeForm(todoProp);
        } else if (todos.length > 0 && id) {
            const todo = todos.find(_t => String(_t.id) === String(id));
            if (todo) {
                initializeForm(todo);
            } else {
                navigate("/404"); // Or handle not found case appropriately
            }
        }
    }, [todoProp, todos, id, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        if (!name) {
            setError({ message: "Title is a required field." });
            return;
        }
        
        const finalTasks = tasks.filter(task => task.description.trim() !== '');
        const updatedTodo = {
            id,
            name,
            description,
            due_on: dueOn.toISOString(),
            tasks: finalTasks,
        };
        try {
            await updateTodo(updatedTodo);
            navigate("/");
        } catch (err) {
            console.error('Error updating todo:', err);
            // The hook should set the error state
        }
    };

    const addTask = () => {
        setTasks(prevTasks => [...(prevTasks || []), { description: "" }]);
    };

    const removeTask = (index) => {
        setTasks(prevTasks => prevTasks.filter((_, ind) => ind !== index));
    };

    const updateTask = (description, index) => {
        setTasks(prevTasks => prevTasks.map((task, _i) =>
            _i === index ? { ...task, description: description } : task
        ));
    };

    const handleCancel = () => {
        navigate("/");
    };

    if (isLoading) return <Loading />;
    if (error && !error.message) return <ServerError error={error} />;

    return (
        <Box sx={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(5px)',
            p: 4
        }}>
            <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
                {/* --- MAIN FORM CARD --- */}
                <Grid item xs={12} md={7} lg={6}>
                    <Paper
                        elevation={12}
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            width: '100%',
                            p: 4,
                            borderRadius: 4,
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease-in-out',
                        }}
                    >
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <IconFactory icon={"todo"} color={"primary"} size={"xxxlg"} />
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Stack spacing={2.5}>
                                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'white' }}>
                                        Update Todo
                                    </Typography>
                                    <FormTextInput label="Title" value={name} setValue={setName} />
                                    <TextAreaInput label="Description" value={description} setValue={setDescription} />
                                    <DateSelector label="Due" value={dueOn} setValue={setDueOn} />
                                    
                                    {error && error.message && <Typography color="error" sx={{ textAlign: 'center' }}>{error.message}</Typography>}
                                    
                                    <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                                        <Button variant="outlined" color="secondary" onClick={handleCancel} fullWidth>Cancel</Button>
                                        <Button type="submit" variant="contained" color="primary" fullWidth>Update</Button>
                                    </Stack>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* --- TASKS PANEL --- */}
                <Grid item xs={12} md={5} lg={4}>
                     <Paper
                        elevation={12}
                        sx={{
                            width: '100%',
                            p: 2,
                            borderRadius: 4,
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <Stack spacing={1}>
                            <Typography variant="h6" sx={{ color: 'white', p: 1 }}>Tasks</Typography>
                            <List sx={{ maxHeight: 350, overflowY: 'auto', p: 1 }}>
                                {tasks && tasks.map((task, index) => (
                                    <Stack key={index} direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                        <FormTextInput
                                            label={`Task ${index + 1}`}
                                            value={task.description}
                                            setValue={(value) => updateTask(value, index)}
                                        />
                                        <IconButton color="error" size="small" onClick={() => removeTask(index)}>
                                            <RemoveCircleOutlineIcon />
                                        </IconButton>
                                    </Stack>
                                ))}
                            </List>
                             <Button
                                startIcon={<AddCircleOutlineIcon />}
                                onClick={addTask}
                                sx={{ alignSelf: 'center' }}
                            >
                                Add Task
                            </Button>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TodoUpdate;
