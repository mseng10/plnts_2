// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from "react-router-dom";
// import Box from '@mui/material/Box';
// import { FormTextInput, TextAreaInput, AutoCompleteInput } from '../../elements/Form';
// import { useMixes, useSoils } from '../../hooks/useMix';
// import IconButton from '@mui/material/IconButton';
// import Stack from '@mui/material/Stack';
// import IconFactory from '../../elements/IconFactory';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
// import List from '@mui/material/List';
// import { ServerError, Loading } from '../../elements/Page';
// import { Paper, Button, Grid, Typography } from '@mui/material';

// const MixUpdate = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     // Hooks
//     const { mixes, error, updateMix, setError, isLoading: mixLoading } = useMixes();
//     const { soils, isLoading: soilsLoading } = useSoils();

//     // State
//     const [name, setName] = useState('');
//     const [description, setDescription] = useState('');
//     const [soilParts, setSoilParts] = useState([]);

//     useEffect(() => {
//         const initializeForm = (mix) => {
//             if (mix && soils.length > 0) {
//                 setName(mix.name || '');
//                 setDescription(mix.description || '');
//                 // Map soil_id to the full soil object for the Autocomplete component
//                 const initialSoilParts = mix.soil_parts?.map(part => ({
//                     ...part,
//                     soil: soils.find(s => s.id === part.soil_id)
//                 })) || [];
//                 setSoilParts(initialSoilParts);
//             }
//         };

//         if (mixes.length > 0 && id) {
//             const mix = mixes.find(_m => String(_m.id) === String(id));
//             if (mix) {
//                 initializeForm(mix);
//             } else {
//                 navigate("/404");
//             }
//         }
//     }, [mixes, soils, id, navigate]);

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         setError(null);

//         if (!name) {
//             setError({ message: "Mix name is required." });
//             return;
//         }

//         const final_soil_parts = soilParts
//             .filter(part => part.soil && part.parts > 0)
//             .map(part => ({
//                 soil_id: part.soil.id,
//                 parts: part.parts
//             }));

//         if (final_soil_parts.length === 0) {
//             setError({ message: "You must add at least one soil ingredient." });
//             return;
//         }

//         try {
//             await updateMix({ id, name, description, experimental: false, soil_parts: final_soil_parts });
//             navigate("/");
//         } catch (err) {
//             console.error("Failed to update mix:", err);
//         }
//     };

//     const handleCancel = () => {
//         navigate("/");
//     };

//     const addSoilPart = () => {
//         setSoilParts(prev => [...prev, { soil: null, parts: 1 }]);
//     };

//     const removeSoilPart = (index) => {
//         setSoilParts(prev => prev.filter((_, i) => i !== index));
//     };

//     const updateSoilPart = (index, field, value) => {
//         setSoilParts(prev => {
//             const newParts = [...prev];
//             newParts[index] = { ...newParts[index], [field]: value };
//             return newParts;
//         });
//     };

//     const handlePartCountChange = (index, delta) => {
//         setSoilParts(prev => {
//             const newParts = [...prev];
//             const currentParts = newParts[index].parts;
//             if (currentParts + delta > 0) {
//                 newParts[index].parts = currentParts + delta;
//             }
//             return newParts;
//         });
//     };

//     if (mixLoading || soilsLoading) return <Loading />;
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
//                                 <IconFactory icon={"mix"} color={"primary"} size={"xxxlg"} />
//                             </Grid>
//                             <Grid item xs={12} md={8}>
//                                 <Stack spacing={2.5}>
//                                     <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'white' }}>
//                                         Update Mix
//                                     </Typography>
//                                     <FormTextInput label="Name" value={name} setValue={setName} />
//                                     <TextAreaInput label="Description" value={description} setValue={setDescription} />
                                    
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

//                 {/* --- SOIL PARTS PANEL --- */}
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
//                             <Typography variant="h6" sx={{ color: 'white', p: 1 }}>Soil Ingredients</Typography>
//                             <List sx={{ maxHeight: 350, overflowY: 'auto', p: 1 }}>
//                                 {soilParts.map((part, index) => (
//                                     <Stack key={index} direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
//                                         <Box sx={{ flexGrow: 1 }}>
//                                             <AutoCompleteInput
//                                                 label={`Soil ${index + 1}`}
//                                                 options={soils}
//                                                 value={part.soil}
//                                                 setValue={(newValue) => updateSoilPart(index, 'soil', newValue)}
//                                             />
//                                         </Box>
//                                         <IconButton size="small" onClick={() => handlePartCountChange(index, -1)}><RemoveCircleOutlineIcon /></IconButton>
//                                         <Typography sx={{ color: 'white', minWidth: '20px', textAlign: 'center' }}>{part.parts}</Typography>
//                                         <IconButton size="small" onClick={() => handlePartCountChange(index, 1)}><AddCircleOutlineIcon /></IconButton>
//                                         <IconButton color="error" size="small" onClick={() => removeSoilPart(index)}>
//                                             <IconFactory icon="close" />
//                                         </IconButton>
//                                     </Stack>
//                                 ))}
//                             </List>
//                              <Button
//                                 startIcon={<AddCircleOutlineIcon />}
//                                 onClick={addSoilPart}
//                                 sx={{ alignSelf: 'center' }}
//                             >
//                                 Add Ingredient
//                             </Button>
//                         </Stack>
//                     </Paper>
//                 </Grid>
//             </Grid>
//         </Box>
//     );
// };

// export default MixUpdate;
