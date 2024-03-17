// Home.js
import React, { useState } from 'react';
import { Grid, Button } from '@mui/material';
import Plant from '../Plant';
import UpdatePlantForm from '../forms/UpdatePlantForm';
import WaterPlantsForm from '../forms/WaterPlantsForm';
import FertilizePlantsForm from '../forms/FertilizePlantsForm';
// import TableRowsSharpIcon from '@mui/icons-material/TableRowsSharp';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
// import GridViewSharpIcon from '@mui/icons-material/GridViewSharp';
import DeleteOutlineSharpIcon from '@mui/icons-material/DeleteOutlineSharp';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import ClearSharpIcon from '@mui/icons-material/ClearSharp';
import KillPlantsForm from '../forms/KillPlantsForm';
import ParkSharpIcon from '@mui/icons-material/ParkSharp';



const Home = ({
  plants,
  setPlants,
  onlyNeedWater,
  handleKillPlant,
}) => {

  // useEffect(() => {
  //   // Update form fields when the plant prop changes
  //   setUpdatedName(plant.name);
  //   setUpdatedType(plant.type);
  //   setUpdatedWateringFrequency(plant.wateringFrequency);
  //   setUpdatedLastWatered(plant.lastWatered);
  // }, [plant]);

  const [isUpdatePlantFormOpen, setIsUpdatePlantFormOpen] = useState(false);
  const [isWaterPlantsFormOpen, setIsWaterPlantsFormOpen] = useState(false);
  const [isKillPlantsFormOpen, setIsKillPlantsFormOpen] = useState(false);
  const [isFertilizePlantsFormOpen, setIsFertilizePlantsFormOpen] = useState(false);
  const [selectedPlants, setSelectedPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState([]);

  const handleSelectPlant = (selectedPlant) => {
    setPlants((prevPlants) =>
      prevPlants.map((plant) =>
        plant.id === selectedPlant.id ? { ...plant, selected: !plant.selected } : plant
      )
    );
    const plantss = [selectedPlant];
    setSelectedPlants(plantss);
    setSelectedPlant(selectedPlant);
  };

  const clearSelections = () => {
    setPlants((prevPlants) =>
      prevPlants.map((plant) =>
        plant.selected ? { ...plant, selected: false } : plant
      )
    );
    setSelectedPlants([]);
    setSelectedPlant(null);
  };

  return (
    <>
      <div>
        <ButtonGroup size="lg" sx={{float: 'right'}}>
          {plants.filter(pl => pl.selected).length === 1 && (
            <IconButton size="large" color="primary" onClick={() => setIsUpdatePlantFormOpen(true)}>
              <EditSharpIcon />
            </IconButton>
          )}
          {plants.filter(pl => pl.selected).length > 0 && (
            <IconButton size="large" color="secondary" onClick={() => setIsWaterPlantsFormOpen(true)}>
              <WaterDropOutlinedIcon />
            </IconButton>
          )}
          {plants.filter(pl => pl.selected).length > 0 && (
            <IconButton size="large" color="error" onClick={() => setIsKillPlantsFormOpen(true)}>
              <DeleteOutlineSharpIcon />
            </IconButton>
          )}
          {plants.filter(pl => pl.selected).length > 0 && (
            <IconButton size="large" sx={{color: '#009688'}} onClick={() => setIsFertilizePlantsFormOpen(true)}>
              <LunchDiningIcon />
            </IconButton>
          )}          
          {plants.filter(pl => pl.selected).length > 0 && (
            <IconButton size="large" sx={{color: '#795548'}} onClick={() => setIsKillPlantsFormOpen(true)}>
              <ParkSharpIcon />
            </IconButton>
          )}
          {plants.filter(pl => pl.selected).length === 1 && (
            <IconButton size="large" color="info" onClick={() => clearSelections()}>
              <ClearSharpIcon />
            </IconButton>
          )}
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
                  onKill={() => handleKillPlant(plant.id)}
                />
              </Button>
            </Grid>
          ))}
        </div>
      </div>
      {isUpdatePlantFormOpen && (
        <UpdatePlantForm
          isOpen={isUpdatePlantFormOpen}
          onRequestClose={() => setIsUpdatePlantFormOpen(false)}
          setPlants={setPlants}
          plant={selectedPlant}
        />
      )}
      {isWaterPlantsFormOpen && (
        <WaterPlantsForm
          isOpen={isWaterPlantsFormOpen}
          onRequestClose={() => setIsWaterPlantsFormOpen(false)}
          setPlants={setPlants}
          plants={selectedPlants}
        />
      )}
      {isKillPlantsFormOpen && (
        <KillPlantsForm
          isOpen={isKillPlantsFormOpen}
          onRequestClose={() => setIsKillPlantsFormOpen(false)}
          setPlants={setPlants}
          plants={selectedPlants}
        />
      )}
      {isFertilizePlantsFormOpen && (
        <FertilizePlantsForm
          isOpen={isFertilizePlantsFormOpen}
          onRequestClose={() => setIsFertilizePlantsFormOpen(false)}
          setPlants={setPlants}
          plants={selectedPlants}
        />
      )}
    </>
  );
};

export default Home;
