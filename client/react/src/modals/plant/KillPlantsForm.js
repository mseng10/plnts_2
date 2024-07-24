import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import { DropdownInput, FormButton } from '../../elements/Form';
import { usePlants } from '../../hooks/usePlants';
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';
import { MODAL_STYLE } from '../../constants';

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

const KillPlantsForm = ({isOpen, initialPlants, onRequestClose}) => {
  const navigate = useNavigate();
  const { plants, isLoading, error, setPlants, killPlant } = usePlants(initialPlants);
  console.log(plants);
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
  }, [plants]);

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
      const killDate = new Date().toISOString().split('T')[0]; // Current date
      for (const plant of checkedPlants) {
        await killPlant(plant.id, killDate, causeOfDeath);
      }
      setPlants(prevPlants => prevPlants.map(plant => 
        checkedPlants.some(checkedPlant => checkedPlant.id === plant.id)
          ? { ...plant, kill_date: killDate, cause_of_death: causeOfDeath }
          : plant
      ));
      clearForm();
      navigate("/");
    } catch (error) {
      console.error('Error killing plants:', error);
      setFormError("Failed to kill plants. Please try again.");
    }
  };

  const handleCancel = () => {
    clearForm();
    navigate("/");
  };

  const clearForm = () => {
    setCheckedPlants([]);
    setAllChecked(false);
    setCauseOfDeath('');
    setFormError(null);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Modal
      open={isOpen}
      onClose={onRequestClose}
      disableAutoFocus={true}
      style={MODAL_STYLE}
    >
      <Box sx={{ width: 756, height: 512, bgcolor: 'background.paper', borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <FormButton
            icon="plant"
            color="error"
            handleCancel={handleCancel}
          />
          <div className='right'>
            <DropdownInput
              label="Cause of Death"
              value={causeOfDeath}
              setValue={setCauseOfDeath}
              options={Object.values(CauseOfDeath)}
              color="error"
            />
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              <ListItem>
                <ListItemText primary="Select All" style={{ color: "black" }}/>
                <Checkbox
                  edge="end"
                  onChange={handleToggleAll}
                  checked={allChecked}
                  color='error'
                />
              </ListItem>
              <Divider sx={{width: '100%' }}  component="li" />
              {plants.map((plant) => (
                <div key={plant.id}>
                  <ListItem
                    disableGutters
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        onChange={handleToggle(plant)}
                        checked={checkedPlants.some(_p => _p.id === plant.id)}
                        color='error'
                      />
                    }
                  >
                    <ListItemText primary={plant.name} style={{ color: "black" }}/>
                  </ListItem>
                  <Divider sx={{width: '100%' }}  component="li" />
                </div>
              ))}
            </List>
            {formError && <div style={{ color: 'red' }}>{formError}</div>}
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default KillPlantsForm;