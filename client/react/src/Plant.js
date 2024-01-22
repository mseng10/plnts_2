// Plant.js
import React from 'react';

const Plant = ({ id, name, type, wateringFrequency, alive, onClick, onKill }) => {
  return (
    <div className={`plant ${alive ? 'alive' : 'not-alive'}`} onClick={onClick}>
      <h3>
        {name}
        {alive && <button onClick={() => onKill(id)}>Kill</button>}
      </h3>
      <p>Type: {type}</p>
      <p>Watering Frequency: {wateringFrequency}</p>
    </div>
  );
};

export default Plant;
