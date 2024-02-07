// Plant.js
import React from 'react';

const Plant = ({ name, type, wateringFrequency, lastWatered, alive, onKill, onWater, onUpdate }) => {

  const handleUpdateClick = () => {
    // Call the onUpdate function
    onUpdate();
  };

  return (
    <div className={`plant ${alive ? 'alive' : 'not-alive'}`}>
      <h3>{name}</h3>
      {alive && (
        <>
          <p>Type: {type}</p>
          <p>Watering Frequency: {wateringFrequency}</p>
          {lastWatered && <p>Last Watered: {lastWatered}</p>}
          <div>
            <button onClick={onWater}>Water</button>
            <button onClick={onKill}>Kill</button>
            <button onClick={handleUpdateClick}>Update</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Plant;
