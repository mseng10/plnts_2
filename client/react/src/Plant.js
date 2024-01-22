// Plant.js
import React from 'react';

const Plant = ({ id, name, type, wateringFrequency, alive, lastWatered, onClick, onKill, onWater }) => {
  const handleWaterClick = () => {
    // Call the onWater function with the plant's id
    onWater(id);
  };

  return (
    <div className={`plant ${alive ? 'alive' : 'not-alive'}`} onClick={onClick}>
      <h3>
        {name}
        {alive && (
          <>
            <button onClick={() => onKill(id)}>Kill</button>
            <button onClick={handleWaterClick}>Water</button>
          </>
        )}
      </h3>
      <p>Type: {type}</p>
      <p>Watering Frequency: {wateringFrequency}</p>
      {alive && <p>Last Watered: {lastWatered}</p>}
    </div>
  );
};

export default Plant;
