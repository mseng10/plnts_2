// Plant.js
import React from 'react';
import Button from '@mui/material/Button';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'

const Plant = ({ name, type, wateringFrequency, lastWatered, alive, onKill, onWater, onUpdate }) => {
  return (
    <div className={`plant ${alive ? 'alive' : 'not-alive'}`}>
      <h3>{name}</h3>
      {alive && (
        <>
          <p>Type: {type}</p>
          <p>Watering Frequency: {wateringFrequency}</p>
          {lastWatered && <p>Last Watered: {lastWatered}</p>}
          <div>
            <Button 
              variant="outlined"
              secondary={true} 
              onClick={onWater}>
              <WaterDropOutlinedIcon color="primary" />
            </Button>
            <Button 
              variant="outlined"
              color="error"              
              onClick={onKill}>
              <DeleteOutlineOutlinedIcon color="error" />
            </Button>
            <Button 
              variant="outlined"
              secondary={true} 
              onClick={onUpdate}>
              <EditOutlinedIcon color="primary" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Plant;
