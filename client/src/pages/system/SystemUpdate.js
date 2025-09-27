// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from "react-router-dom";
// import Box from '@mui/material/Box';
// import { SliderInput, TextAreaInput, FormTextInput, AutoCompleteInput } from '../../elements/Form';
// import { useSystems, humidityMarks, temperatureMarks, durationMarks, distanceMarks, useLights } from '../../hooks/useSystems';
// import { Stack, Button, Paper, Grid, Typography, IconButton, List } from '@mui/material';
// import IconFactory from '../../elements/IconFactory';
// import { ServerError, Loading } from '../../elements/Page';
// import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// const SystemUpdate = ({ systemProp }) => {
//     const { id } = useParams();
//     const navigate = useNavigate();
    
//     // Hooks
//     const { systems, isLoading: systemLoading, error, updateSystem, setError } = useSystems();
//     const { lights, isLoading: lightsLoading } = useLights();

//     // Form Fields
//     const [name, setName] = useState('');
//     const [description, setDescription] = useState('');
//     const [target_humidity, setHumidity] = useState(60);
//     const [target_temperature, setTempurature] = useState(68);
//     const [duration, setDuration] = useState(12);
//     const [distance, setDistance] = useState(24);
//     const [systemLights, setSystemLights] = useState([]);

//     useEffect(() => {
//         const initializeForm = (system) => {
//             if (system) {
//                 setName(system.name || '');
//                 setDescription(system.description || '');
//                 setHumidity(system.target_humidity || 60);
//                 setTempurature(system.target_temperature || 68);
//                 setDuration(system.duration || 12);
//                 setDistance(system.distance || 24);
//                 // Initialize lights panel based on system's lights
//                 const initialLights = system.lights?.map(light => ({ light })) || [];
//                 setSystemLights(initialLights);
//             }
//         };

//         if (systemProp) {
//             initializeForm(systemProp);
//         } else if (systems.length > 0 && id) {
//             const system = systems.find(_s => String(_s.id) === String(id));
//             if (system) {
//                 initializeForm(system);
//             } else {
//                 navigate("/404");
//             }
//         }
//     }, [systemProp, systems, id, navigate]);

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         setError(null);

//         if (!name) {
//             setError({ message: "System name is required." });
//             return;
//         }

//         const light_ids = systemLights
//             .map(item => item.light ? item.light.id : null)
//             .filter(id => id !== null);
        
//         if (light_ids.length === 0) {
//             setError({ message: "You must add at least one light." });
//             return;
//         }

//         const updatedSystem = {
//             id,
//             name,
//             description,
//             target_humidity: parseInt(target_humidity, 10),
//             target_temperature: parseInt(target_temperature, 10),
//             duration: parseInt(duration, 10),
//             distance: parseInt(distance, 10),
//             light_ids
//         };

//         try {
//             await updateSystem(updatedSystem);
//             navigate("/");
//         } catch (err) {
//             console.error('Error updating system:', err);
//         }
//     };

//     const handleCancel = () => {
//         navigate("/");
//     };

//     const addLight = () => {
//         setSystemLights(prev => [...prev, { light: null }]);
//     };

//     const removeLight = (index) => {
//         setSystemLights(prev => prev.filter((_, i) => i !== index));
//     };

//     const updateLight = (index, value) => {
//         setSystemLights(prev => {
//             const newLights = [...prev];
//             newLights[index].light = value;
//             return newLights;
//         });
//     };

//     if (systemLoading || lightsLoading) return <Loading />;
//     if (error && !error.message) return <ServerError error={error} />;

//     return (
//         <Box sx={{
//             minHeight: '100vh',
//             width: '100%',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             backdropFilter: 'blur(5px)',
//             p: 4
//         }}>
//             <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
//                 {/* --- MAIN FORM CARD --- */}
//                 <Grid item xs={12} md={7} lg={6}>
//                     <Paper
//                         elevation={12}
//                         component="form"
//                         onSubmit={handleSubmit}
//                         sx={{
//                             width: '100%',
//                             p: 4,
//                             borderRadius: 4,
//                             border: '1px solid rgba(255, 255, 255, 0.2)',
//                             backgroundColor: 'rgba(255, 255, 255, 0.1)',
//                             backdropFilter: 'blur(10px)',
//                             transition: 'all 0.3s ease-in-out',
//                         }}
//                     >
//                         <Grid container spacing={4}>
//                             <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                                 <IconFactory icon={"system"} color={"primary"} size={"xxxlg"} />
//                             </Grid>
//                             <Grid item xs={12} md={8}>
//                                 <Stack spacing={2.5}>
//                                     <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'white' }}>
//                                         Update System
//                                     </Typography>
//                                     <FormTextInput label="Name" value={name} setValue={setName} />
//                                     <TextAreaInput label="Description" value={description} setValue={setDescription} />
//                                     <SliderInput label="Humidity" value={target_humidity} setValue={setHumidity} marks={humidityMarks} min={0} max={100} />
//                                     <SliderInput label="Temperature" value={target_temperature} setValue={setTempurature} marks={temperatureMarks} min={48} max={80} step={2} />
//                                     <SliderInput label="Duration" value={duration} setValue={setDuration} marks={durationMarks} min={6} max={18} />
//                                     <SliderInput label="Distance" value={distance} setValue={setDistance} marks={distanceMarks} min={12} max={36} step={2} />

//                                     {error && error.message && <Typography color="error" sx={{ textAlign: 'center' }}>{error.message}</Typography>}
                                    
//                                     <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
//                                         <Button variant="outlined" color="secondary" onClick={handleCancel} fullWidth>Cancel</Button>
//                                         <Button type="submit" variant="contained" color="primary" fullWidth>Update</Button>
//                                     </Stack>
//                                 </Stack>
//                             </Grid>
//                         </Grid>
//                     </Paper>
//                 </Grid>

//                 {/* --- LIGHTS PANEL --- */}
//                 <Grid item xs={12} md={5} lg={4}>
//                      <Paper
//                         elevation={12}
//                         sx={{
//                             width: '100%',
//                             p: 2,
//                             borderRadius: 4,
//                             border: '1px solid rgba(255, 255, 255, 0.2)',
//                             backgroundColor: 'rgba(255, 255, 255, 0.1)',
//                             backdropFilter: 'blur(10px)',
//                         }}
//                     >
//                         <Stack spacing={1}>
//                             <Typography variant="h6" sx={{ color: 'white', p: 1 }}>Lights</Typography>
//                             <List sx={{ maxHeight: 350, overflowY: 'auto', p: 1 }}>
//                                 {systemLights.map((item, index) => (
//                                     <Stack key={index} direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
//                                         <Box sx={{ flexGrow: 1 }}>
//                                             <AutoCompleteInput
//                                                 label={`Light ${index + 1}`}
//                                                 options={lights}
//                                                 value={item.light}
//                                                 setValue={(newValue) => updateLight(index, newValue)}
//                                             />
//                                         </Box>
//                                         <IconButton color="error" size="small" onClick={() => removeLight(index)}>
//                                             <RemoveCircleOutlineIcon />
//                                         </IconButton>
//                                     </Stack>
//                                 ))}
//                             </List>
//                              <Button
//                                 startIcon={<AddCircleOutlineIcon />}
//                                 onClick={addLight}
//                                 sx={{ alignSelf: 'center' }}
//                             >
//                                 Add Light
//                             </Button>
//                         </Stack>
//                     </Paper>
//                 </Grid>
//             </Grid>
//         </Box>
//     );
// };

// export default SystemUpdate;
