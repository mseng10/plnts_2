import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { useSpecies } from '../../../hooks/usePlants';
import { AutoCompleteInput, FormTextInput } from '../../../elements/Form';

const SpeciesCreateCard = ({ onClose, onSpeciesCreated, genera = [], genusTypes = [] }) => {
    // Updated to use the createAll function from the useSpecies hook.
    const { createAll } = useSpecies();
    const [speciesName, setSpeciesName] = useState('');
    const [selectedGenus, setSelectedGenus] = useState(null);
    const [showGenusForm, setShowGenusForm] = useState(false);
    const [genusName, setGenusName] = useState('');
    const [selectedGenusType, setSelectedGenusType] = useState(null);
    const [showGenusTypeForm, setShowGenusTypeForm] = useState(false);
    const [genusTypeName, setGenusTypeName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(''); // Clear previous errors

        // --- Start Validation ---
        if (!speciesName) {
            setError('Species name is required');
            return;
        }

        // If not creating a new genus, an existing one must be selected.
        if (!showGenusForm && !selectedGenus) {
            setError('Genus is required');
            return;
        }
        
        // If creating a new genus, its name is required.
        if (showGenusForm && !genusName.trim()) {
            setError('New genus name is required');
            return;
        }
        
        // If creating a new genus, a genus type (new or existing) is required.
        if (showGenusForm && !showGenusTypeForm && !selectedGenusType) {
            setError('Genus type is required for a new genus');
            return;
        }
        
        // If creating a new genus type, its name is required.
        if (showGenusTypeForm && !genusTypeName.trim()) {
            setError('New genus type name is required');
            return;
        }
        // --- End Validation ---

        try {
            // Determine the final genusType object to be sent.
            // It's either a new object with a name, or the existing selected object.
            const genusTypeForPayload = showGenusTypeForm 
                ? { name: genusTypeName.trim() } 
                : selectedGenusType;

            // Determine the final genus object.
            // If creating a new one, embed the genusType object within it.
            const genusForPayload = showGenusForm 
                ? { name: genusName.trim(), } 
                : selectedGenus;

            // The species object is always new in this form.
            const speciesForPayload = { name: speciesName.trim() };

            // Construct the single payload object as requested.
            const payload = {
                species: speciesForPayload,
                genus: genusForPayload,
                genus_type: genusTypeForPayload,
            };

            // Call the createAll command with the consolidated payload.
            const result = await createAll(payload);
            
            // Notify the parent component of success and close the card.
            onSpeciesCreated(result.species);
            onClose();

        } catch (err) {
            setError('Error creating new plant data. Please try again.');
            console.error(err);
        }
    };

    const handleCloseGenusForm = () => {
        setShowGenusForm(false);
        setGenusName('');
        setSelectedGenusType(null);
        if (showGenusTypeForm) {
            setShowGenusTypeForm(false);
            setGenusTypeName('');
        }
    };

    const handleCloseGenusTypeForm = () => {
        setShowGenusTypeForm(false);
        setGenusTypeName('');
    };

    return (
        <Box sx={{
            width: '100%',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 4, 
            backdropFilter: 'blur(10px)',
            maxHeight: 'calc(100vh - 32px)',
            display: 'flex',
            flexDirection: 'column',
            padding: 2
            }}>
            <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    {/* Species Section */}
                    <Box sx={{
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 2,
                        padding: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.05)'
                    }}>
                        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                            Species
                        </Typography>
                        
                        <Stack spacing={2}>
                            <FormTextInput
                                label="Name"
                                value={speciesName}
                                setValue={setSpeciesName}
                                color="primary"
                            />
                            
                            <Box sx={{ position: 'relative' }}>
                                <AutoCompleteInput
                                    label="Genera"
                                    value={selectedGenus}
                                    setValue={setSelectedGenus}
                                    options={genera}
                                    color="primary"
                                    sx={{ paddingRight: '48px' }}
                                    disabled={showGenusForm}
                                />
                                <IconButton 
                                    onClick={() => setShowGenusForm(!showGenusForm)}
                                    color="primary"
                                    sx={{
                                        position: 'absolute',
                                        right: 8,
                                        top: '50%',
                                        transform: 'translateY(-50%)'
                                    }}
                                >
                                    <AddIcon />
                                </IconButton>
                            </Box>
                        </Stack>
                    </Box>

                    {/* Genus Creation Section */}
                    {showGenusForm && (
                        <Box sx={{
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: 2,
                            padding: 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.05)'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                                    New Genus
                                </Typography>
                                <IconButton 
                                    onClick={handleCloseGenusForm}
                                    color="error"
                                    size="small"
                                    sx={{ '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' } }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                            
                            <Stack spacing={2}>
                                <FormTextInput
                                    label="Name"
                                    value={genusName}
                                    setValue={setGenusName}
                                    color="primary"
                                />
                                
                                <Box sx={{ position: 'relative' }}>
                                    <AutoCompleteInput
                                        label="Genus Type"
                                        value={selectedGenusType}
                                        setValue={setSelectedGenusType}
                                        options={genusTypes}
                                        color="primary"
                                        sx={{ paddingRight: '48px' }}
                                        disabled={showGenusTypeForm}
                                    />
                                    <IconButton 
                                        onClick={() => setShowGenusTypeForm(!showGenusTypeForm)}
                                        color="primary"
                                        sx={{
                                            position: 'absolute',
                                            right: 8,
                                            top: '50%',
                                            transform: 'translateY(-50%)'
                                        }}
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </Box>
                            </Stack>
                        </Box>
                    )}

                    {/* Genus Type Creation Section (only shows if Genus form is open) */}
                    {showGenusForm && showGenusTypeForm && (
                        <Box sx={{
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: 2,
                            padding: 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.05)'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6" sx={{ color: 'white' }}>
                                    New Genus Type
                                </Typography>
                                <IconButton 
                                    onClick={handleCloseGenusTypeForm}
                                    color="error"
                                    size="small"
                                    sx={{ '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' } }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                            
                            <FormTextInput
                                label="Name"
                                value={genusTypeName}
                                setValue={setGenusTypeName}
                                color="primary"
                            />
                        </Box>
                    )}

                    {/* Error Display */}
                    {error && (
                        <Typography color="error" sx={{ textAlign: 'center', mt: 2 }}>
                            {error}
                        </Typography>
                    )}

                    {/* Form Buttons */}
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button onClick={onClose} color="secondary">
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="primary">
                            Create All
                        </Button>
                    </Stack>
                </Stack>
            </form>
        </Box>
    );
};

export default SpeciesCreateCard;
