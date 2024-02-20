// Home.js
import React, { useState } from 'react';
import { Grid } from '@mui/material';
import Plant from './Plant';
// import NewPlantForm from './forms/NewPlantForm';
import UpdatePlantForm from './forms/UpdatePlantForm';

const Home = ({
  plants,
  onlyNeedWater,
  handleKillPlant,
  handleWaterPlant,
}) => {

  const [isUpdatePlantFormOpen, setIsUpdatePlantFormOpen] = useState(false);

  const handleUpdatePlant = (updatedPlant) => {
    // Update the plant data on the server or perform other actions
    // setPlants((prevPlants) =>
    //   prevPlants.map((plant) => (plant.id === updatedPlant.id ? updatedPlant : plant))
    // );
    console.log(updatedPlant);
    setIsUpdatePlantFormOpen(false);
  };

  const handlePlantClick = (plant) => {
    // Open the update plant form when a plant is clicked
    console.log(plant);
    setIsUpdatePlantFormOpen(true);
  };


  return (
    <>
      <div className="plant-grid">
        {plants.filter((word) => onlyNeedWater ? word.wateringFrequency > Date.now() : true).map((plant) => (
          <Grid key={plant.id} item xs={12} sm={6} md={4} lg={3} xl={2}>
            <Plant
              {...plant}
              onUpdate={() => handlePlantClick(plant)}
              onKill={() => handleKillPlant(plant.id)}
              onWater={() => handleWaterPlant(plant.id)}
            />
          </Grid>
        ))}
      </div>
      {/* <NewPlantForm
        isOpen={isNewPlantFormOpen}
        onRequestClose={() => setIsNewPlantFormOpen(false)}
        onSave={handleSavePlant}
      /> */}
      {isUpdatePlantFormOpen && (
        <UpdatePlantForm
          isOpen={isUpdatePlantFormOpen}
          onRequestClose={() => setIsUpdatePlantFormOpen(false)}
          onUpdate={handleUpdatePlant}
          plant={null} // TODO: SET TO PLANT
        />
      )}
    </>
  );
};

export default Home;
