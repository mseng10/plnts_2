import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Button, 
  Typography, 
  Stack, 
  Modal,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Divider
} from '@mui/material';
import { DropdownInput } from '../../elements/Form';
import { usePlants } from '../../hooks/usePlants';
import { useSpecies } from '../../hooks/usePlants';
import { Loading, ServerError } from '../../elements/Page';
import IconFactory from '../../elements/IconFactory';

// Enum for cause of death
const CauseOfDeath = Object.freeze({
  DISEASE: 'Disease',
  PEST: 'Pest',
  OVERWATERING: 'Overwatering',
  UNDERWATERING: 'Underwatering',
  NUTRIENT_DEFICIENCY: 'Nutrient Deficiency',
  PHYSICAL_DAMAGE: 'Physical Damage',
  OLD_AGE: 'Old Age',
  UNKNOWN: 'Unknown'
});

const DeprecatePlantsForm = ({ isOpen, initialPlants, onRequestClose }) => {
  const { plants, isLoading, error, setPlants, deprecatePlants } = usePlants(initialPlants);
  const { species } = useSpecies();
  const [checkedPlants, setCheckedPlants] = useState([]);
  const [allChecked, setAllChecked] = useState(true);
  const [causeOfDeath, setCauseOfDeath] = useState('');
  const [formError, setFormError] = useState(null);

  // Initialize all plants as checked when the component mounts or plants change
  useEffect(() => {
    if (plants.length > 0) {
      setCheckedPlants([...plants]);
      setAllChecked(true);
    }
  }, [plants, initialPlants]);

  const handleToggle = (plant) => () => {
    const currentIndex = checkedPlants.findIndex(_p => _p.id === plant.id);
    const newChecked = [...checkedPlants];

    if (currentIndex === -1) {
      newChecked.push(plant);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedPlants(newChecked);
    setAllChecked(newChecked.length === plants.length);
  };

  const handleToggleAll = () => {
    if (allChecked) {
      setCheckedPlants([]);
    } else {
      setCheckedPlants([...plants]);
    }
    setAllChecked(!allChecked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (checkedPlants.length === 0) {
      setFormError("Please select at least one plant");
      return;
    }
    if (!causeOfDeath) {
      setFormError("Please select a cause of death");
      return;
    }

    try {
      const deprecateDate = new Date().toISOString().split('T')[0]; // Current date
      await deprecatePlants(deprecateDate, causeOfDeath);

      setPlants(prevPlants => prevPlants.map(plant => 
        checkedPlants.some(checkedPlant => checkedPlant.id === plant.id)
          ? { ...plant, deprecate_date: deprecateDate, cause_of_death: causeOfDeath }
          : plant
      ));
      clearForm();
      onRequestClose();
    } catch (error) {
      console.error('Error deprecating plants:', error);
      setFormError("Failed to deprecate plants. Please try again.");
    }
  };

  const handleCancel = () => {
    clearForm();
    onRequestClose();
  };

  const clearForm = () => {
    setCheckedPlants([]);
    setAllChecked(false);
    setCauseOfDeath('');
    setFormError(null);
  };

  if (isLoading) return <Loading />;
  if (error) return <ServerError error={error} />;

  return (
    <Modal
      open={isOpen}
      onClose={onRequestClose}
      disableAutoFocus={true}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(5px)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <Paper
        elevation={12}
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '90%',
          maxWidth: 600,
          maxHeight: '80vh',
          p: 4,
          borderRadius: 4,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease-in-out',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <IconFactory icon="deprecate" color="error" size="lg" />
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'white', flexGrow: 1 }}>
            Remove Plants
          </Typography>
        </Stack>

        {/* Cause of Death Dropdown */}
        <Box sx={{ mb: 3 }}>
          <DropdownInput
            label="Cause of Death"
            value={causeOfDeath}
            setValue={setCauseOfDeath}
            options={Object.values(CauseOfDeath)}
          />
        </Box>

        {/* Plant List */}
        <Box sx={{ 
          flexGrow: 1, 
          overflow: 'auto',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <List sx={{ width: '100%' }}>
            {/* Select All Option */}
            <ListItem sx={{ 
              backgroundColor: 'rgba(244, 67, 54, 0.1)',
              '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.15)' }
            }}>
              <ListItemText 
                primary="Select All" 
                sx={{ 
                  '& .MuiListItemText-primary': { 
                    color: 'white', 
                    fontWeight: 'bold' 
                  } 
                }} 
              />
              <Checkbox
                edge="end"
                onChange={handleToggleAll}
                checked={allChecked}
                color="error"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-checked': {
                    color: 'error.main',
                  }
                }}
              />
            </ListItem>
            
            <Divider sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              borderColor: 'rgba(255, 255, 255, 0.2)'
            }} />

            {/* Individual Plants */}
            {plants.map((plant, index) => (
              <React.Fragment key={plant.id}>
                <ListItem
                  disableGutters
                  sx={{ 
                    px: 2,
                    '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.05)' },
                    transition: 'background-color 0.2s ease-in-out'
                  }}
                  secondaryAction={
                    <Checkbox
                      edge="end"
                      onChange={handleToggle(plant)}
                      checked={checkedPlants.some(_p => _p.id === plant.id)}
                      color="error"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-checked': {
                          color: 'error.main',
                        }
                      }}
                    />
                  }
                >
                  <ListItemText 
                    primary={species.find(_s => _s.id === plant.species_id)?.name || 'N/A'}
                    sx={{ 
                      '& .MuiListItemText-primary': { 
                        color: 'white' 
                      } 
                    }} 
                  />
                </ListItem>
                {index < plants.length - 1 && (
                  <Divider sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }} />
                )}
              </React.Fragment>
            ))}
          </List>
        </Box>

        {/* Error Message */}
        {formError && (
          <Typography 
            color="error" 
            sx={{ 
              textAlign: 'center', 
              mt: 2,
              backgroundColor: 'rgba(244, 67, 54, 0.1)',
              border: '1px solid rgba(244, 67, 54, 0.3)',
              borderRadius: 1,
              p: 1
            }}
          >
            {formError}
          </Typography>
        )}

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} sx={{ pt: 3 }}>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={handleCancel} 
            fullWidth
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: 'white',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="error" 
            fullWidth
            disabled={checkedPlants.length === 0 || !causeOfDeath}
          >
            Remove Selected Plants ({checkedPlants.length})
          </Button>
        </Stack>
      </Paper>
    </Modal>
  );
};

export default DeprecatePlantsForm;