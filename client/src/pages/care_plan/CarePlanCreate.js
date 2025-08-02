import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Paper, Grid, Stack, Typography, Button } from '@mui/material';
import { FormTextInput, NumberInput } from '../../elements/Form';
import IconFactory from '../../elements/IconFactory';
import { useCarePlans } from '../../hooks/useCarePlans';
import { ServerError, Loading } from '../../elements/Page';

const CarePlanCreate = () => {
    const navigate = useNavigate();
    // Assuming a similar hook structure for care plans
    const { createCarePlan, isLoading, error } = useCarePlans();

    // Form State based on the CarePlan model
    const [name, setName] = useState('');
    const [watering, setWatering] = useState('');
    const [fertilizing, setFertilizing] = useState('');
    const [cleaning, setCleaning] = useState('');
    const [potting, setPotting] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!name) {
            return;
        }

        const newCarePlan = {
            name,
            watering: parseInt(watering) || null,
            fertilizing: parseInt(fertilizing) || null,
            cleaning: parseInt(cleaning) || null,
            potting: parseInt(potting) || null,
        };

        try {
            await createCarePlan(newCarePlan);
            navigate("/"); // Navigate to a relevant page on success
        } catch (err) {
            console.error('Error creating care plan:', err);
            // The hook should handle setting the specific error message
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
                                    icon={"care_plan"}
                                    color={"primary"}
                                    size={"xxxlg"}
                                />
                            </Grid>

                            {/* --- FORM FIELDS --- */}
                            <Grid item xs={12} md={8}>
                                <Stack spacing={2.5}>
                                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'white' }}>
                                        New Care Plan
                                    </Typography>
                                    
                                    <FormTextInput
                                        label="Plan Name"
                                        value={name}
                                        setValue={setName}
                                    />

                                    <Typography variant="h6" component="h2" sx={{ color: 'white', pt: 1 }}>
                                        Frequencies (in days)
                                    </Typography>

                                    <Grid container spacing={2}>
                                        <Grid item xs={6} sm={6}><NumberInput label="Watering" value={watering} setValue={setWatering} /></Grid>
                                        <Grid item xs={6} sm={6}><NumberInput label="Fertilizing" value={fertilizing} setValue={setFertilizing} /></Grid>
                                        <Grid item xs={6} sm={6}><NumberInput label="Cleaning" value={cleaning} setValue={setCleaning} /></Grid>
                                        <Grid item xs={6} sm={6}><NumberInput label="Potting" value={potting} setValue={setPotting} /></Grid>
                                    </Grid>

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

export default CarePlanCreate;
