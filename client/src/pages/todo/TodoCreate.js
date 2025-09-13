import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import { FormTextInput, TextAreaInput, DateSelector, AutoCompleteInput } from '../../elements/Form';
import dayjs from 'dayjs';
import { useTodos } from '../../hooks/useTodos';
import { useGoals } from '../../hooks/useGoals'; // Assuming a hook for goals exists
import { List, Stack, Button, Paper, Grid, Typography, IconButton } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import IconFactory from '../../elements/IconFactory';

const TodoCreate = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [tasks, setTasks] = useState([]);
    const [dueOn, setDueOn] = useState(dayjs());
    const [goal, setGoal] = useState(null); // State for the selected goal
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { createTodo } = useTodos();
    const { goals } = useGoals(); // Fetching the list of goals

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        if (!name) {
            setError("Title is a required field.");
            return;
        }

        try {
            // Filter out any empty tasks before submitting
            const finalTasks = tasks.filter(task => task.description.trim() !== '');
            const newTodo = {
                name,
                description,
                due_on: dueOn.toISOString(),
                tasks: finalTasks,
                goal_id: goal ? goal.id : null // Add goal_id to the payload
            };
            await createTodo(newTodo);
            navigate("/");
        } catch (err) {
            setError("Failed to create todo. Please try again.");
            console.error(err);
        }
    };

    const handleCancel = () => {
        navigate("/");
    };

    const removeTask = (index) => {
        setTasks(prevTasks => prevTasks.filter((_, ind) => ind !== index));
    };

    const addTask = () => {
        setTasks(prevTasks => [...prevTasks, { description: "" }]);
    };

    const updateTask = (description, index) => {
        setTasks(prevTasks => prevTasks.map((task, _i) =>
            _i === index ? { ...task, description: description } : task
        ));
    };

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
                            {/* --- ICON AREA --- */}
                            <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <IconFactory
                                    icon={"todo"}
                                    color={"primary"}
                                    size={"xxxlg"}
                                />
                            </Grid>

                            {/* --- FORM FIELDS --- */}
                            <Grid item xs={12} md={8}>
                                <Stack spacing={2.5}>
                                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'white' }}>
                                        Create a New Todo
                                    </Typography>
                                    <FormTextInput label="Title" value={name} setValue={setName} />
                                    <TextAreaInput label="Description" value={description} setValue={setDescription} />
                                    <DateSelector label="Due" value={dueOn} setValue={setDueOn} />
                                    <AutoCompleteInput
                                        label="Goal"
                                        value={goal}
                                        setValue={setGoal}
                                        options={goals}
                                    />
                                    {error && <Typography color="error" sx={{ textAlign: 'center' }}>{error}</Typography>}
                                    <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                                        <Button variant="outlined" color="secondary" onClick={handleCancel} fullWidth>
                                            Cancel
                                        </Button>
                                        <Button type="submit" variant="contained" color="primary" fullWidth>
                                            Submit
                                        </Button>
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
                            transition: 'all 0.3s ease-in-out',
                        }}
                    >
                        <Stack spacing={1}>
                            <Typography variant="h6" sx={{ color: 'white', p:1 }}>Tasks</Typography>
                            <List sx={{maxHeight: 350, overflowY: 'auto', p: 1}}>
                                {tasks.map((task, index) => (
                                    <Stack key={index} direction="row" alignItems="center" spacing={1} sx={{mb: 1}}>
                                        <FormTextInput
                                            label={`Task ${index + 1}`}
                                            value={task.description}
                                            setValue={(value) => updateTask(value, index)}
                                        />
                                        <IconButton color="error" onClick={() => removeTask(index)}>
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

export default TodoCreate;
