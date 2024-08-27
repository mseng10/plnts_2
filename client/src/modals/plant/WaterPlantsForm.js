import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { FormButton } from '../../elements/Form';
import { usePlants } from '../../hooks/usePlants';
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';
import { MODAL_STYLE } from '../../constants';
import { ServerError } from '../../elements/Page';

const WaterPlantsForm = ({ isOpen, initialPlants, onRequestClose }) => {
  const { plants, isLoading, error, setPlants, waterPlants } = usePlants(initialPlants);
  const [checkedPlants, setCheckedPlants] = useState([]);
  const [allChecked, setAllChecked] = useState(true);
  const [formError, setFormError] = useState(null);

  // Initialize all plants as checked when the component mounts or plants change
  useEffect(() => {
    if (plants.length > 0) {
      setCheckedPlants([...plants]);
      setAllChecked(true);
    }
    console.log(initialPlants);
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

    try {
      const waterDate = new Date().toISOString().split('T')[0]; // Current date
      for (const plant of checkedPlants) {
        await waterPlants(plant.id);
      }
      setPlants(prevPlants => prevPlants.map(plant => 
        checkedPlants.some(checkedPlant => checkedPlant.id === plant.id)
          ? { ...plant, watered_on: waterDate }
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
    setFormError(null);  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <ServerError/>;

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
            icon="water"
            color="info"
            handleCancel={handleCancel}
          />
          <div className='right'>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              <ListItem>
                <ListItemText primary="Select All" style={{ color: "black" }}/>
                <Checkbox
                  edge="end"
                  onChange={handleToggleAll}
                  checked={allChecked}
                  color='info'
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
                        color='info'
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

export default WaterPlantsForm;
