// Home.js
import React, { useState } from 'react';
import { Grid } from '@mui/material';
import Plant from '../Plant';
// import NewPlantForm from './forms/NewPlantForm';
import UpdatePlantForm from '../forms/UpdatePlantForm';
import TableRowsSharpIcon from '@mui/icons-material/TableRowsSharp';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import GridViewSharpIcon from '@mui/icons-material/GridViewSharp';

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

  const handleSelectPlant = (plant) => {
    // Open the update plant form when a plant is clicked
    console.log(plant);
    setIsUpdatePlantFormOpen(true);
  };

  const changeGridView = (gridView) => {
    console.log(gridView);
  }


  return (
    <>
      <div>
        <ButtonGroup size="lg">
          <IconButton size="small" color="info" onClick={() => changeGridView(true)}>
            <TableRowsSharpIcon />
          </IconButton>
          <IconButton size="small" color="info" onClick={() => changeGridView(true)}>
            <GridViewSharpIcon />
          </IconButton>
        </ButtonGroup>
        <div className="plant-grid">
          {plants.filter((word) => onlyNeedWater ? word.wateringFrequency > Date.now() : true).map((plant) => (
            <Grid key={plant.id} item xs={12} sm={6} md={4} lg={3} xl={2}>
              <Plant
                {...plant}
                onSelect={() => handleSelectPlant(plant)}
                onUpdate={() => handlePlantClick(plant)}
                onKill={() => handleKillPlant(plant.id)}
                onWater={() => handleWaterPlant(plant.id)}
              />
            </Grid>
          ))}
        </div>
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
