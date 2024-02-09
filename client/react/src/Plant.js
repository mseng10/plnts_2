// Plant.js
import React from 'react';
import Button from '@mui/material/Button';

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
              variant="contained" 
              secondary={true} 
              onClick={onWater}>
                Water
            </Button>
            <Button 
              variant="contained" 
              secondary={true} 
              onClick={onKill}>
                Kill
            </Button>
            <Button 
              variant="contained" 
              secondary={true} 
              onClick={onUpdate}>
                Update
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Plant;
