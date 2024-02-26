// Home.js
import React, { useState } from 'react';
import { Grid, Button } from '@mui/material';
import Plant from '../Plant';
// import NewPlantForm from './forms/NewPlantForm';
import UpdatePlantForm from '../forms/UpdatePlantForm';
// import TableRowsSharpIcon from '@mui/icons-material/TableRowsSharp';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
// import GridViewSharpIcon from '@mui/icons-material/GridViewSharp';
import DeleteOutlineSharpIcon from '@mui/icons-material/DeleteOutlineSharp';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import ClearSharpIcon from '@mui/icons-material/ClearSharp';

const Home = ({
  plants,
  setPlants,
  onlyNeedWater,
  handleKillPlant,
  handleWaterPlant,
}) => {

  const [isUpdatePlantFormOpen, setIsUpdatePlantFormOpen] = useState(false);
  const [editedPlant, setEditedPlant] = useState(null);

  const handleUpdatePlant = (updatedPlant) => {
    // Update the plant data on the server or perform other actions
    // setPlants((prevPlants) =>
    //   prevPlants.map((plant) => (plant.id === updatedPlant.id ? updatedPlant : plant))
    // );
    console.log(updatedPlant);
    setIsUpdatePlantFormOpen(false);
  };

  const handleSelectPlant = (selectedPlant) => {
    setPlants((prevPlants) =>
      prevPlants.map((plant) =>
        plant.id === selectedPlant.id ? { ...plant, selected: !plant.selected } : plant
      )
    );
  };

  const editPlant = (plant) => {
    setEditedPlant(plant ? plant : plants.filter(pl => pl.selected));

    // Open the update plant form when a plant is clicked
    setIsUpdatePlantFormOpen(true);
  };


  return (
    <>
      <div>
        <ButtonGroup size="lg" sx={{float: 'right'}}>
          <IconButton size="large" color="primary" onClick={() => handleSelectPlant(true)}>
            <EditSharpIcon />
          </IconButton>
          <IconButton size="large" color="secondary" onClick={() => handleSelectPlant(true)}>
            <WaterDropOutlinedIcon />
          </IconButton>
          <IconButton size="large" color="error" onClick={() => handleSelectPlant(true)}>
            <DeleteOutlineSharpIcon />
          </IconButton>
          <IconButton size="large" color="info" onClick={() => editPlant(null)}>
            <ClearSharpIcon />
          </IconButton>
        </ButtonGroup>
        <div className="plant-grid">
          {plants.filter((word) => onlyNeedWater ? word.wateringFrequency > Date.now() : true).map((plant) => (
            <Grid key={plant.id} item xs={12} sm={6} md={4} lg={3} xl={2}>
              <Button className={plant.selected ? 'selected' : ''} onClick= {() => handleSelectPlant(plant) } sx={{
                textTransform: "none",
                ml: 1,
                "&.MuiButtonBase-root:hover": {
                  bgcolor: "transparent"
                },
              }}>
                <Plant
                  {...plant}
                  onSelect={() => handleSelectPlant(plant)}
                  onKill={() => handleKillPlant(plant.id)}
                  onWater={() => handleWaterPlant(plant.id)}
                />
              </Button>
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
          plant={editedPlant} // TODO: SET TO PLANT
        />
      )}
    </>
  );
};

export default Home;
