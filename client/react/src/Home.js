// Home.js

import React from 'react';
import { Grid } from '@mui/material';
import Plant from './Plant';
import NewPlantForm from './forms/NewPlantForm';
import UpdatePlantForm from './forms/UpdatePlantForm';

const Home = ({
  plants,
  isNewPlantFormOpen,
  isUpdatePlantFormOpen,
  setIsNewPlantFormOpen,
  setIsUpdatePlantFormOpen,
  handleSavePlant,
  handleKillPlant,
  handlePlantClick,
  handleUpdatePlant,
  handleWaterPlant,
}) => {
  return (
    <>
      <div className="plant-grid">
        {plants.map((plant) => (
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
      <NewPlantForm
        isOpen={isNewPlantFormOpen}
        onRequestClose={() => setIsNewPlantFormOpen(false)}
        onSave={handleSavePlant}
      />
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
