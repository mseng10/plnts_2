import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import CheckSharpIcon from '@mui/icons-material/CheckSharp';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';

const WaterPlantsForm = ({ isOpen, plants, setPlants, onRequestClose }) => {
  const [checked, setChecked] = useState(plants);
  const [submitted, setSubmit] = useState(false);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleWaterPlants = () => {
    const plantsById = new Map(plants.map((obj) => [obj.id, obj]));

    setPlants((prevPlants) =>
      prevPlants.map((plant) =>
        plantsById.get(plant.id) ? { ...plant, lastWatered: new Date().toLocaleString() } : plant
      )
    );
  };

  const handleSubmit = (event) => {
    setSubmit(true);
    handleWaterPlants();
    event.preventDefault();
    clearForm();
    onRequestClose();
  };

  const handleCancel = () => {
    clearForm();
    onRequestClose();
  };

  const getDisplayName = (plant) => {
    return plant.name;
  };

  const clearForm = () => {};

  return (
    <Modal
      open={isOpen}
      onClose={onRequestClose}
      aria-labelledby="new-bobby-form"
      disableAutoFocus={true}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'inherit',
        border: 'none',
      }}
    >
      <Box sx={{ width: 512, bgcolor: 'background.paper', borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <div className='left'>
            <WaterDropOutlinedIcon color='secondary' className={submitted ? 'home_icon_form_submit' : 'home_icon_form'}/>
            <ButtonGroup>
              <IconButton className="left_button" type="submit" color="primary">
                <CheckSharpIcon className="left_button"/>
              </IconButton>
              <IconButton className="left_button" color="error" onClick={handleCancel}>
                <CloseSharpIcon className="left_button"/>
              </IconButton>
            </ButtonGroup>
          </div>
          <div className='right'>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              {plants.map((plant) => (
                <div key={plant.id}>
                  <ListItem
                    disableGutters
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        onChange={handleToggle(plant)}
                        checked={checked.indexOf(plant) !== -1}
                        color='secondary'
                      />
                    }
                  >
                    <ListItemText primary={getDisplayName(plant)} />
                  </ListItem>
                  <Divider sx={{width: '100%' }}  component="li" />
                </div>
              ))}
            </List>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default WaterPlantsForm;
