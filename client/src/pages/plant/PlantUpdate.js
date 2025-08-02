import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import { AutoCompleteInput, DropdownInput, NumberInput, DateSelector } from '../../elements/Form';
import { usePlants, useSpecies } from '../../hooks/usePlants';
import { useCarePlans } from '../../hooks/useCarePlans';
import { PHASE_LABELS } from '../../constants';
import { ServerError, Loading } from '../../elements/Page';
import { useMixes } from '../../hooks/useMix';
import { Paper, Button, Grid, Typography, Stack } from '@mui/material';
import IconFactory from '../../elements/IconFactory';
import dayjs from 'dayjs';

const PlantUpdate = ({ plantProp }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Hooks
    const { plants, systems, isLoading: plantsLoading, error, updatePlant, setError } = usePlants();
    const { mixes, isLoading: mixesLoading } = useMixes();
    const { species, isLoading: speciesLoading } = useSpecies();
    const { carePlans, isLoading: carePlansLoading } = useCarePlans();

    // Fields
    const [selectedSpecies, setSelectedSpecies] = useState(null);
    const [mix, setMix] = useState(null);
    const [system, setSystem] = useState(null);
    const [carePlan, setCarePlan] = useState(null);
    const [size, setSize] = useState('');
    const [cost, setCost] = useState('');
    const [phase, setPhase] = useState("adult");
    
    // Date fields
    const [potted_on, setPottedOn] = useState(dayjs());
    const [watered_on, setWateredOn] = useState(dayjs());
    const [fertilized_on, setFertilizedOn] = useState(dayjs());
    const [cleansed_on, setCleansedOn] = useState(dayjs());

    useEffect(() => {
        const initializeForm = (plant) => {
            if (plant && mixes.length && species.length && systems.length && carePlans.length) {
                setMix(mixes.find(_m => _m.id === plant.mix_id) || null);
                setSelectedSpecies(species.find(_s => _s.id === plant.species_id) || null);
                setSystem(systems.find(_s => _s.id === plant.system_id) || null);
                setCarePlan(carePlans.find(_c => _c.id === plant.care_plan_id) || null);
                setSize(plant.size || '');
                setCost(plant.cost || '');
                setPhase(plant.phase || "adult");
                setPottedOn(dayjs(plant.potted_on));
                setWateredOn(dayjs(plant.watered_on));
                setFertilizedOn(dayjs(plant.fertilized_on));
                setCleansedOn(dayjs(plant.cleansed_on));
            }
        };

        if (plantProp) {
            initializeForm(plantProp);
        } else if (plants.length > 0 && id) {
            const plant = plants.find(_p => String(_p.id) === String(id));
            if (plant) {
                initializeForm(plant);
            } else {
                navigate("/404");
            }
        }
    }, [plantProp, plants, id, species, mixes, systems, carePlans, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        if (!selectedSpecies || !mix || !system) {
            setError({ message: "Species, Mix, and System are required fields." });
            return;
        }

        const updatedPlant = {
            id,
            size: size || 0,
            cost: cost || 0,
            mix_id: mix.id,
            system_id: system.id,
            species_id: selectedSpecies.id,
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

    const isLoading = plantsLoading || mixesLoading || speciesLoading || carePlansLoading;
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
