// import React, { useState, useEffect } from 'react';
// import { 
//   Box, 
//   Paper, 
//   Button, 
//   Typography, 
//   Stack, 
//   Grid, 
//   IconButton,
//   Modal,
//   Divider,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   TextField
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import DeleteIcon from '@mui/icons-material/Delete';
// import IconFactory from '../../elements/IconFactory';
// import { AutoCompleteInput, DropdownInput, NumberInput } from '../../elements/Form';
// import { usePlants, useSpecies } from '../../hooks/usePlants';
// import { useMixes } from '../../hooks/useMix';
// import { useCarePlans } from '../../hooks/useCarePlans';
// import { PHASE_LABELS } from '../../constants';
// import { Loading, ServerError } from '../../elements/Page';

// const PropagationPlantForm = ({ isOpen, plantId, onRequestClose }) => {
//   const { plants, systems, isLoading: plantsLoading, error, propagatePlant } = usePlants();
//   const { mixes, isLoading: mixesLoading } = useMixes();
//   const { species, isLoading: speciesLoading } = useSpecies();
//   const { carePlans, isLoading: carePlansLoading } = useCarePlans();

//   const [sourcePlant, setSourcePlant] = useState(null);
//   const [rootPlantAction, setRootPlantAction] = useState('persist'); // 'persist' or 'kill'
//   const [propagations, setPropagations] = useState([{
//     id: 1,
//     phase: 'seedling',
//     count: 1,
//     mix: null,
//     system: null,
//     carePlan: null
//   }]);
//   const [formError, setFormError] = useState(null);

//   // Find the source plant
//   useEffect(() => {
//     if (plants.length > 0 && plantId) {
//       const plant = plants.find(p => String(p.id) === String(plantId));
//       if (plant) {
//         setSourcePlant(plant);
//       }
//     }
//   }, [plants, plantId]);

//   const addPropagation = () => {
//     const newId = Math.max(...propagations.map(p => p.id)) + 1;
//     setPropagations([...propagations, {
//       id: newId,
//       phase: 'seedling',
//       count: 1,
//       mix: null,
//       system: null,
//       carePlan: null
//     }]);
//   };

//   const removePropagation = (id) => {
//     if (propagations.length > 1) {
//       setPropagations(propagations.filter(p => p.id !== id));
//     }
//   };

//   const updatePropagation = (id, field, value) => {
//     setPropagations(propagations.map(p => 
//       p.id === id ? { ...p, [field]: value } : p
//     ));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setFormError(null);

//     // Validate propagations
//     const invalidPropagations = propagations.filter(p => !p.mix || !p.system || p.count < 1);
//     if (invalidPropagations.length > 0) {
//       setFormError("All propagations must have a mix, system, and count of at least 1.");
//       return;
//     }

//     try {
//       const propagationData = {
//         sourceId: plantId,
//         rootAction: rootPlantAction,
//         propagations: propagations.map(p => ({
//           phase: p.phase,
//           count: p.count,
//           mix_id: p.mix.id,
//           system_id: p.system.id,
//           care_plan_id: p.carePlan ? p.carePlan.id : null,
//           species_id: sourcePlant.species_id // Inherit from source
//         }))
//       };

//       await propagatePlant(propagationData);
//       onRequestClose();
//     } catch (error) {
//       console.error('Error propagating plant:', error);
//       setFormError("Failed to propagate plant. Please try again.");
//     }
//   };

//   const handleCancel = () => {
//     setPropagations([{
//       id: 1,
//       phase: 'seedling',
//       count: 1,
//       mix: null,
//       system: null,
//       carePlan: null
//     }]);
//     setRootPlantAction('persist');
//     setFormError(null);
//     onRequestClose();
//   };

//   const isLoading = plantsLoading || mixesLoading || speciesLoading || carePlansLoading || !sourcePlant;

//   if (isLoading) return <Loading />;
//   if (error) return <ServerError error={error} />;

//   const sourceSpecies = species.find(s => s.id === sourcePlant?.species_id);

//   return (
//     <Modal
//       open={isOpen}
//       onClose={onRequestClose}
//       disableAutoFocus={true}
//       sx={{
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backdropFilter: 'blur(5px)',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//       }}
//     >
//       <Paper
//         elevation={12}
//         component="form"
//         onSubmit={handleSubmit}
//         sx={{
//           width: '95%',
//           maxWidth: 1200,
//           maxHeight: '90vh',
//           p: 4,
//           borderRadius: 4,
//           border: '1px solid rgba(255, 255, 255, 0.2)',
//           backgroundColor: 'rgba(255, 255, 255, 0.1)',
//           backdropFilter: 'blur(10px)',
//           transition: 'all 0.3s ease-in-out',
//           overflow: 'auto',
//         }}
//       >
//         {/* Header */}
//         <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
//           <IconFactory icon="plant" color="primary" size="lg" />
//           <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'white', flexGrow: 1 }}>
//             Propagate Plant - {sourceSpecies?.name || 'Unknown Species'}
//           </Typography>
//         </Stack>

//         <Grid container spacing={4}>
//           {/* Source Plant */}
//           <Grid item xs={12} md={4}>
//             <Paper
//               elevation={8}
//               sx={{
//                 p: 3,
//                 borderRadius: 3,
//                 border: '1px solid rgba(76, 175, 80, 0.3)',
//                 backgroundColor: 'rgba(76, 175, 80, 0.1)',
//                 backdropFilter: 'blur(10px)',
//                 height: '100%',
//                 minHeight: 300,
//               }}
//             >
//               <Stack spacing={2} alignItems="center">
//                 <IconFactory icon="plant" color="success" size="xl" />
//                 <Typography variant="h6" sx={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
//                   Source Plant
//                 </Typography>
//                 <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center' }}>
//                   {sourceSpecies?.name || 'Unknown Species'}
//                 </Typography>
                
//                 <Divider sx={{ width: '100%', bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
                
//                 <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
//                   Phase: {sourcePlant?.phase || 'N/A'}
//                 </Typography>
//                 <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
//                   Size: {sourcePlant?.size || 'N/A'}
//                 </Typography>

//                 <Box sx={{ mt: 'auto', width: '100%' }}>
//                   <FormControl fullWidth variant="outlined" sx={{
//                     '& .MuiOutlinedInput-root': {
//                       backgroundColor: 'rgba(255, 255, 255, 0.05)',
//                       '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
//                       '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
//                     },
//                     '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
//                     '& .MuiSelect-select': { color: 'white' },
//                   }}>
//                     <InputLabel>Root Plant Action</InputLabel>
//                     <Select
//                       value={rootPlantAction}
//                       onChange={(e) => setRootPlantAction(e.target.value)}
//                       label="Root Plant Action"
//                     >
//                       <MenuItem value="persist">Keep Root Plant</MenuItem>
//                       <MenuItem value="kill">Remove Root Plant</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Box>
//               </Stack>
//             </Paper>
//           </Grid>

//           {/* Propagations */}
//           <Grid item xs={12} md={8}>
//             <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//               <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
//                 <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
//                   Propagations
//                 </Typography>
//                 <Button
//                   onClick={addPropagation}
//                   startIcon={<AddIcon />}
//                   variant="outlined"
//                   size="small"
//                   sx={{
//                     borderColor: 'rgba(255, 255, 255, 0.3)',
//                     color: 'white',
//                     '&:hover': {
//                       borderColor: 'rgba(255, 255, 255, 0.5)',
//                       backgroundColor: 'rgba(255, 255, 255, 0.05)',
//                     }
//                   }}
//                 >
//                   Add Propagation
//                 </Button>
//               </Stack>

//               <Box sx={{ 
//                 flexGrow: 1, 
//                 overflow: 'auto',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 gap: 2
//               }}>
//                 {propagations.map((prop, index) => (
//                   <Paper
//                     key={prop.id}
//                     elevation={4}
//                     sx={{
//                       p: 2,
//                       borderRadius: 2,
//                       border: '1px solid rgba(33, 150, 243, 0.3)',
//                       backgroundColor: 'rgba(33, 150, 243, 0.1)',
//                       backdropFilter: 'blur(10px)',
//                     }}
//                   >
//                     <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
//                       <IconFactory icon="plant" color="info" size="sm" />
//                       <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 'bold', flexGrow: 1 }}>
//                         Propagation #{index + 1}
//                       </Typography>
//                       {propagations.length > 1 && (
//                         <IconButton
//                           onClick={() => removePropagation(prop.id)}
//                           size="small"
//                           sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
//                         >
//                           <DeleteIcon fontSize="small" />
//                         </IconButton>
//                       )}
//                     </Stack>

//                     <Grid container spacing={2}>
//                       <Grid item xs={6}>
//                         <DropdownInput 
//                           label="Phase" 
//                           value={prop.phase} 
//                           options={Object.values(PHASE_LABELS)} 
//                           setValue={(value) => updatePropagation(prop.id, 'phase', value)} 
//                         />
//                       </Grid>
//                       <Grid item xs={6}>
//                         <NumberInput 
//                           label="Count" 
//                           value={prop.count} 
//                           setValue={(value) => updatePropagation(prop.id, 'count', Math.max(1, parseInt(value) || 1))}
//                           min={1}
//                         />
//                       </Grid>
//                       <Grid item xs={6}>
//                         <AutoCompleteInput 
//                           label="Mix" 
//                           value={prop.mix} 
//                           setValue={(value) => updatePropagation(prop.id, 'mix', value)} 
//                           options={mixes} 
//                         />
//                       </Grid>
//                       <Grid item xs={6}>
//                         <AutoCompleteInput 
//                           label="System" 
//                           value={prop.system} 
//                           setValue={(value) => updatePropagation(prop.id, 'system', value)} 
//                           options={systems} 
//                         />
//                       </Grid>
//                       <Grid item xs={12}>
//                         <AutoCompleteInput 
//                           label="Care Plan (Optional)" 
//                           value={prop.carePlan} 
//                           setValue={(value) => updatePropagation(prop.id, 'carePlan', value)} 
//                           options={carePlans} 
//                         />
//                       </Grid>
//                     </Grid>
//                   </Paper>
//                 ))}
//               </Box>
//             </Box>
//           </Grid>
//         </Grid>

//         {/* Error Message */}
//         {formError && (
//           <Typography 
//             color="error" 
//             sx={{ 
//               textAlign: 'center', 
//               mt: 3,
//               backgroundColor: 'rgba(244, 67, 54, 0.1)',
//               border: '1px solid rgba(244, 67, 54, 0.3)',
//               borderRadius: 1,
//               p: 2
//             }}
//           >
//             {formError}
//           </Typography>
//         )}

//         {/* Action Buttons */}
//         <Stack direction="row" spacing={2} sx={{ pt: 4 }}>
//           <Button 
//             variant="outlined" 
//             color="secondary" 
//             onClick={handleCancel} 
//             fullWidth
//             sx={{
//               borderColor: 'rgba(255, 255, 255, 0.3)',
//               color: 'white',
//               '&:hover': {
//                 borderColor: 'rgba(255, 255, 255, 0.5)',
//                 backgroundColor: 'rgba(255, 255, 255, 0.05)',
//               }
//             }}
//           >
//             Cancel
//           </Button>
//           <Button 
//             type="submit" 
//             variant="contained" 
//             color="primary" 
//             fullWidth
//           >
//             Propagate Plant ({propagations.reduce((sum, p) => sum + p.count, 0)} new plants)
//           </Button>
//         </Stack>
//       </Paper>
//     </Modal>
//   );
// };

// export default PropagationPlantForm;