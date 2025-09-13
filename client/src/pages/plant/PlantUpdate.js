import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import { AutoCompleteInput, DropdownInput, NumberInput, DateSelector } from '../../elements/Form';
import { usePlants, useSpecies } from '../../hooks/usePlants';
import { useCarePlans } from '../../hooks/useCarePlans';
import { PHASE_LABELS } from '../../constants';
import { ServerError, Loading } from '../../elements/Page';
import { useMixes } from '../../hooks/useMix';
import { Paper, Button, Grid, Typography, Stack, TextField } from '@mui/material';
import IconFactory from '../../elements/IconFactory';
import dayjs from 'dayjs';

const PlantUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Hooks
    const { plants, systems, isLoading: plantsLoading, error, updatePlant } = usePlants();
    const { mixes, isLoading: mixesLoading } = useMixes();
    const { species, isLoading: speciesLoading } = useSpecies();
    const { carePlans, isLoading: carePlansLoading } = useCarePlans();

    // Form initialization state
    const [formInitialized, setFormInitialized] = useState(false);
    const [currentPlant, setCurrentPlant] = useState(null);

    // Fields
    const [selectedSpecies, setSelectedSpecies] = useState(null);
    const [mix, setMix] = useState(null);
    const [system, setSystem] = useState(null);
    const [carePlan, setCarePlan] = useState(null);
    const [size, setSize] = useState('');
    const [cost, setCost] = useState('');
    const [phase, setPhase] = useState("adult");
    const [description, setDescription] = useState('');
    
    // Date fields
    const [potted_on, setPottedOn] = useState(dayjs());
    const [watered_on, setWateredOn] = useState(dayjs());
    const [fertilized_on, setFertilizedOn] = useState(dayjs());
    const [cleansed_on, setCleansedOn] = useState(dayjs());

    // Find the plant first
    useEffect(() => {
        if (plants.length > 0 && id && !currentPlant) {
            const plant = plants.find(_p => String(_p.id) === String(id));
            if (plant) {
                setCurrentPlant(plant);
            } else {
                navigate("/404");
            }
        }
    }, [plants, id, currentPlant, navigate]);

    // Initialize form when we have the plant and data is loaded (even if arrays are empty)
    useEffect(() => {
        const initializeForm = () => {
            if (currentPlant && 
                !mixesLoading && 
                !speciesLoading && 
                !plantsLoading && 
                !carePlansLoading && 
                !formInitialized) {
                
                console.log('Initializing form with plant:', currentPlant);
                console.log('Available mixes:', mixes);
                console.log('Available species:', species);
                console.log('Available systems:', systems);
                console.log('Available carePlans:', carePlans);
                
                // Find matching items, or null if not found
                setMix(mixes.find(_m => _m.id === currentPlant.mix_id) || null);
                setSelectedSpecies(species.find(_s => _s.id === currentPlant.species_id) || null);
                setSystem(systems.find(_s => _s.id === currentPlant.system_id) || null);
                setCarePlan(carePlans.find(_c => _c.id === currentPlant.care_plan_id) || null);
                
                // Set other fields
                setSize(currentPlant.size || '');
                setCost(currentPlant.cost || '');
                setPhase(currentPlant.phase || "adult");
                setDescription(currentPlant.description || '');
                
                // Handle dates safely
                setPottedOn(currentPlant.potted_on ? dayjs(currentPlant.potted_on) : dayjs());
                setWateredOn(currentPlant.watered_on ? dayjs(currentPlant.watered_on) : dayjs());
                setFertilizedOn(currentPlant.fertilized_on ? dayjs(currentPlant.fertilized_on) : dayjs());
                setCleansedOn(currentPlant.cleansed_on ? dayjs(currentPlant.cleansed_on) : dayjs());
                
                setFormInitialized(true);
            }
        };

        initializeForm();
    }, [currentPlant, mixes, species, systems, carePlans, mixesLoading, speciesLoading, plantsLoading, carePlansLoading, formInitialized]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // if (!selectedSpecies || !mix || !system) {
        //     return;
        // }

        const updatedPlant = {
            id,
            size: size || 0,
            cost: cost || 0,
            description: description || '',
            mix_id: mix ? mix.id: null,
            system_id: system.id,
            species_id: selectedSpecies ? selectedSpecies.id : null,
            care_plan_id: carePlan ? carePlan.id : null,
            phase,
            potted_on: potted_on.toISOString(),
            watered_on: watered_on.toISOString(),
            fertilized_on: fertilized_on.toISOString(),
            cleansed_on: cleansed_on.toISOString(),
        };

        try {
            await updatePlant(updatedPlant);
            navigate("/");
        } catch (err) {
            console.error('Error updating plant:', err);
        }
    };

    const handleCancel = () => {
        navigate("/");
    };

    // Glassmorphism styling for the description field
    const getFormFieldStyles = () => ({
        '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
            },
        },
        '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            '&.Mui-focused': {
                color: 'primary.main',
            },
        },
        '& .MuiInputBase-input': {
            color: 'white',
        },
    });

    // Show loading if any of the critical data is still loading OR if form is not initialized yet
    const isLoading = plantsLoading || mixesLoading || speciesLoading || carePlansLoading || !formInitialized;
    
    if (isLoading) return <Loading />;
    if (error && !error.message) return <ServerError error={error} />;

    // Debug info - you can remove this once it's working
    console.log('Render state:', {
        currentPlant,
        formInitialized,
        isLoading,
        plantsCount: plants.length,
        mixesCount: mixes.length,
        speciesCount: species.length,
        systemsCount: systems.length,
        carePlansCount: carePlans.length
    });

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
                            <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <IconFactory icon={"plant"} color={"primary"} size={"xxxlg"} />
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Stack spacing={2.5}>
                                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'white' }}>
                                        Update Plant
                                    </Typography>
                                    <AutoCompleteInput label="Species" value={selectedSpecies} setValue={setSelectedSpecies} options={species} />
                                    <AutoCompleteInput label="Mix" value={mix} setValue={setMix} options={mixes} />
                                    <AutoCompleteInput label="System" value={system} setValue={setSystem} options={systems} />
                                    <AutoCompleteInput label="Care Plan" value={carePlan} setValue={setCarePlan} options={carePlans} />
                                    <DropdownInput label="Phase" value={phase} options={Object.values(PHASE_LABELS)} setValue={setPhase} />
                                    
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}><NumberInput label="Size" value={size} setValue={setSize} /></Grid>
                                        <Grid item xs={6}><NumberInput label="Cost" value={cost} setValue={setCost} /></Grid>
                                    </Grid>

                                    <TextField
                                        label="Description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        multiline
                                        rows={3}
                                        fullWidth
                                        variant="outlined"
                                        placeholder="Add notes about your plant (optional)"
                                        sx={getFormFieldStyles()}
                                    />

                                    <Grid container spacing={2}>
                                        <Grid item xs={6}><DateSelector label="Potted On" value={potted_on} setValue={setPottedOn} /></Grid>
                                        <Grid item xs={6}><DateSelector label="Watered On" value={watered_on} setValue={setWateredOn} /></Grid>
                                        <Grid item xs={6}><DateSelector label="Fertilized On" value={fertilized_on} setValue={setFertilizedOn} /></Grid>
                                        <Grid item xs={6}><DateSelector label="Cleansed On" value={cleansed_on} setValue={setCleansedOn} /></Grid>
                                    </Grid>

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
            </Grid>
        </Box>
    );
};

export default PlantUpdate;