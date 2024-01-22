// App.js
import React, { useState, useEffect } from 'react';
import Plant from './Plant';
import NewPlantForm from './NewPlantForm';
import UpdatePlantForm from './UpdatePlantForm';

const App = () => {
  const [plants, setPlants] = useState([]);
  const [isNewPlantFormOpen, setIsNewPlantFormOpen] = useState(false);
  const [isUpdatePlantFormOpen, setIsUpdatePlantFormOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);

  useEffect(() => {
    // Fetch plant data from the server
    fetch('https://example.com/api/plants')
      .then((response) => response.json())
      .then((data) => setPlants(data))
      .catch((error) => console.error('Error fetching plant data:', error));
  }, []);

  const handleSavePlant = (newPlant) => {
    // Add the "alive" field with a default value of true
    const plantWithAliveField = { ...newPlant, alive: true };

    // Save the new plant data to the server or perform other actions
    setPlants((prevPlants) => [...prevPlants, { id: Date.now(), ...plantWithAliveField }]);
    setIsNewPlantFormOpen(false);
  };

  const handleKillPlant = (plantId) => {
    // Mark the plant as no longer active (alive: false)
    setPlants((prevPlants) =>
      prevPlants.map((plant) => (plant.id === plantId ? { ...plant, alive: false } : plant))
    );
  };

  const handlePlantClick = (plant) => {
    // Open the update plant form when a plant is clicked
    setSelectedPlant(plant);
    setIsUpdatePlantFormOpen(true);
  };

  const handleUpdatePlant = (updatedPlant) => {
    // Update the plant data on the server or perform other actions
    setPlants((prevPlants) =>
      prevPlants.map((plant) => (plant.id === updatedPlant.id ? updatedPlant : plant))
    );
    setIsUpdatePlantFormOpen(false);
  };

  return (
    <div className="App">
      <h1>Plant Grid App</h1>
      <button className="add-plant-button" onClick={() => setIsNewPlantFormOpen(true)}>
        ➕
      </button>
      <div className="plant-grid">
        {plants.map((plant) => (
          <Plant
            key={plant.id}
            {...plant}
            onClick={() => handlePlantClick(plant)}
            onKill={handleKillPlant}
          />
        ))}
      </div>
      <NewPlantForm
        isOpen={isNewPlantFormOpen}
        onRequestClose={() => setIsNewPlantFormOpen(false)}
        onSave={handleSavePlant}
      />
      {selectedPlant && (
        <UpdatePlantForm
          isOpen={isUpdatePlantFormOpen}
          onRequestClose={() => setIsUpdatePlantFormOpen(false)}
          onUpdate={handleUpdatePlant}
          plant={selectedPlant}
        />
      )}
    </div>
  );
};

export default App;
