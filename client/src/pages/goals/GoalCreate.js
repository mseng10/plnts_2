import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import { FormTextInput, TextAreaInput, DateSelector } from '../../elements/Form';
import dayjs from 'dayjs';
import { useGoals } from '../../hooks/useGoals';
import { Stack, Button, Paper, Grid, Typography } from '@mui/material';
import IconFactory from '../../elements/IconFactory';
import { ServerError, Loading } from '../../elements/Page';

const GoalCreate = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [dueMonth, setDueMonth] = useState(dayjs());
    
    const navigate = useNavigate();
    const { createGoal, isLoading, error } = useGoals();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!name) {
            return;
        }

        try {
            const newGoal = {
                name,
                description,
                // Format the date to "YYYY-MM" for the due_month field
                due_month: dueMonth.format('YYYY-MM'), 
            };
            await createGoal(newGoal);
            navigate("/"); // Navigate to a relevant page on success
        } catch (err) {
            console.error("Failed to create goal:", err);
            // The hook will handle setting the error state
        }
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
                <Grid item xs={12} md={8} lg={7}>
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
                                    icon={"goal"} // Assuming a 'goal' icon exists
                                    color={"primary"}
                                    size={"xxxlg"}
                                />
                            </Grid>

                            {/* --- FORM FIELDS --- */}
                            <Grid item xs={12} md={8}>
                                <Stack spacing={2.5}>
                                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'white' }}>
                                        Create a New Goal
                                    </Typography>
                                    <FormTextInput label="Goal Name" value={name} setValue={setName} />
                                    <TextAreaInput label="Description" value={description} setValue={setDescription} />
                                    <DateSelector 
                                        label="Due Month" 
                                        value={dueMonth} 
                                        setValue={setDueMonth}
                                        views={['year', 'month']}
                                        format="MMMM YYYY"
                                    />
                                    
                                    {error && error.message && <Typography color="error" sx={{ textAlign: 'center' }}>{error.message}</Typography>}
                                    
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
            </Grid>
        </Box>
    );
};

export default GoalCreate;
