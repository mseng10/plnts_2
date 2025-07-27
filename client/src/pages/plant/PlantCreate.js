import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
import { AutoCompleteInput, DropdownInput, FormButton, NumberInput } from '../../elements/Form';
import { usePlants, useSpecies } from '../../hooks/usePlants';
import { PHASE_LABELS } from '../../constants';
import { useMixes } from '../../hooks/useMix';
import { ServerError, Loading } from '../../elements/Page';
import SpeciesCreateCard from './species/SpeciesCreateCard';
import { Paper, Button, Typography } from '@mui/material';
import IconFactory from '../../elements/IconFactory';

const PlantCreate = () => {
    const navigate = useNavigate();
    const { systems, isLoading, error, createPlant } = usePlants();
    const { species } = useSpecies();
    const { mixes } = useMixes(true);

    const [selectedSpecies, setSelectedSpecies] = useState(null);
    const [system, setSystem] = useState(null);
    const [mix, setMix] = useState(null);
    const [size, setSize] = useState(''); // Use empty string for better placeholder behavior
    const [cost, setCost] = useState('');
    const [watering, setWatering] = useState('');
    const [phase, setPhase] = useState(PHASE_LABELS.adult);
    const [showSpeciesCreate, setShowSpeciesCreate] = useState(false);
    const [formError, setFormError] = useState('');

    const handleSpeciesCreated = (newSpecies) => {
        // The useSpecies hook should handle re-fetching and updating the list.
        setSelectedSpecies(newSpecies);
        setShowSpeciesCreate(false); // Hide card on successful creation
    };

    const handleSpeciesCreateClose = () => {
        setShowSpeciesCreate(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError(''); // Reset error on new submission

        // --- Form Validation ---
        if (!selectedSpecies || !system || !mix || !phase) {
            setFormError('Please fill out all required fields.');
            return;
        }

        const newPlant = {
            size: size || 0, // Default to 0 if empty
            cost: cost || 0,
            species_id: selectedSpecies.id,
            system_id: system.id,
            mix_id: mix.id,
            watering: watering || 0,
            phase
        };

        try {
            await createPlant(newPlant);
            navigate("/"); // Navigate to home on success
        } catch (error) {
            console.error('Error adding new plant:', error);
            setFormError('Failed to create plant. Please try again.');
        }
    };

    const handleCancel = () => {
        navigate("/");
    };

    if (isLoading) return <Loading />;
    if (error) return <ServerError />;

    return (
        <Box sx={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // Semi-transparent background
            backdropFilter: 'blur(5px)',
            p: 4
        }}>
            <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
                {/* --- MAIN FORM CARD --- */}
                <Grid item xs={12} md={showSpeciesCreate ? 7 : 8} lg={showSpeciesCreate ? 6 : 7}>
                    <Paper
                        elevation={12}
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            width: '100%',
                            p: 4,
                            borderRadius: 4,
                            // Styles updated to match the SpeciesCreateCard
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
                                icon={"plant"}
                                color={"primary"}
                                size={"xxxlg"}
                              />
                            </Grid>

                            {/* --- FORM FIELDS --- */}
                            <Grid item xs={12} md={8}>
                                <Stack spacing={2.5}>
                                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'white' }}>
                                        New Bubby Alert!
                                    </Typography>
                                    
                                    <Box sx={{ position: 'relative' }}>
                                        <AutoCompleteInput
                                            label="Species"
                                            value={selectedSpecies}
                                            setValue={setSelectedSpecies}
                                            options={species}
                                        />
                                        <IconButton
                                            onClick={() => setShowSpeciesCreate(true)}
                                            color="primary"
                                            sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}
                                        >
                                            <AddIcon />
                                        </IconButton>
                                    </Box>
                                    
                                    <AutoCompleteInput label="System" value={system} setValue={setSystem} options={systems} />
                                    <AutoCompleteInput label="Mix" value={mix} setValue={setMix} options={mixes} />
                                    <DropdownInput label="Phase" value={phase} options={Object.values(PHASE_LABELS)} setValue={setPhase} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={4}><NumberInput label="Size" value={size} setValue={setSize} /></Grid>
                                        <Grid item xs={4}><NumberInput label="Cost" value={cost} setValue={setCost} /></Grid>
                                        <Grid item xs={4}><NumberInput label="Watering" value={watering} setValue={setWatering} /></Grid>
                                    </Grid>

                                    {formError && <Typography color="error" sx={{ textAlign: 'center' }}>{formError}</Typography>}

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

                {/* --- SPECIES CREATE CARD (Conditional) --- */}
                {showSpeciesCreate && (
                    <Grid item xs={12} md={5} lg={4}>
                        <SpeciesCreateCard
                            onClose={handleSpeciesCreateClose}
                            onSpeciesCreated={handleSpeciesCreated}
                        />
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default PlantCreate;
