// Home.js
import React, { useState, useEffect } from 'react';
import UpdatePlantForm from '../forms/UpdatePlantForm';
import WaterPlantsForm from '../forms/WaterPlantsForm';
import FertilizePlantsForm from '../forms/FertilizePlantsForm';
import RepotPlantsForm from '../forms/RepotPlantsForm';
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
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';



const Plants = () => {

  const columns = [
    { field: 'id', headerName: 'ID', width: 20 },
    {
      field: 'size',
      headerName: 'Size',
      width: 20,
      editable: false,
    },
    {
      field: 'cost',
      headerName: 'Cost',
      type: 'number',
      width: 20,
      editable: false,
    },
    {
      field: 'created_on',
      headerName: 'Created On',
      type: 'string',
      width: 150,
      editable: false
    },
    {
      field: 'watered_on',
      headerName: 'Watered On',
      type: 'string',
      width: 150,
      editable: false
    },
    {
      field: 'species_id',
      headerName: 'Species',
      width: 150,
      editable: false,
      valueGetter: (value) => {
        if (!value) {
          return "Nan";
        }
        const speciesObj = species.find(_s => _s.id == value.value)
        
        return speciesObj ? speciesObj.name : "Nan";
      },
    }
  ];

  const [plants, setPlants] = useState([]);
  const [species, setSpecies] = useState([]);
  const [isUpdatePlantFormOpen, setIsUpdatePlantFormOpen] = useState(false);
  const [isWaterPlantsFormOpen, setIsWaterPlantsFormOpen] = useState(false);
  const [isKillPlantsFormOpen, setIsKillPlantsFormOpen] = useState(false);
  const [isFertilizePlantsFormOpen, setIsFertilizePlantsFormOpen] = useState(false);
  const [isRepotPlantsFormOpen, setIsRepotPlantsFormOpen] = useState(false);
  const [selectedPlants, setSelectedPlants] = useState([]);

  // const handleSelectPlant = (selectedPlant) => {
  //   setPlants((prevPlants) =>
  //     prevPlants.map((plant) =>
  //       plant.id === selectedPlant.id ? { ...plant, selected: !plant.selected } : plant
  //     )
  //   );
  //   const newSelectedPlants = selectedPlants.concat(selectedPlant);
  //   setSelectedPlants(newSelectedPlants);
  // };

  useEffect(() => {
    // Fetch plant data from the server
    fetch('http://127.0.0.1:5000/plants')
      .then((response) => response.json())
      .then((data) => setPlants(data))
      .catch((error) => console.error('Error fetching plant data:', error));
    fetch('http://127.0.0.1:5000/species')
      .then((response) => response.json())
      .then((data) => setSpecies(data))
      .catch((error) => console.error('Error fetching plant data:', error));
  }, []);

  const clearSelections = () => {
    setPlants((prevPlants) =>
      prevPlants.map((plant) =>
        plant.selected ? { ...plant, selected: false } : plant
      )
    );
    setSelectedPlants([]);
  };

  return (
    <>
      <div>
        <ButtonGroup size="lg" sx={{float: 'right'}}>
          {selectedPlants.length === 1 && (
            <IconButton size="large" color="primary" onClick={() => setIsUpdatePlantFormOpen(true)}>
              <EditSharpIcon />
            </IconButton>
          )}
          {selectedPlants.length > 0 && (
            <IconButton size="large" color="secondary" onClick={() => setIsWaterPlantsFormOpen(true)}>
              <WaterDropOutlinedIcon />
            </IconButton>
          )}
          {selectedPlants.length > 0 && (
            <IconButton size="large" color="error" onClick={() => setIsKillPlantsFormOpen(true)}>
              <DeleteOutlineSharpIcon />
            </IconButton>
          )}
          {selectedPlants.length > 0 && (
            <IconButton size="large" sx={{color: '#009688'}} onClick={() => setIsFertilizePlantsFormOpen(true)}>
              <LunchDiningIcon />
            </IconButton>
          )}          
          {selectedPlants.length > 0 && (
            <IconButton size="large" color='repot' onClick={() => setIsRepotPlantsFormOpen(true)}>
              <ParkSharpIcon />
            </IconButton>
          )}
          {selectedPlants.length === 1 && (
            <IconButton size="large" color="info" onClick={() => clearSelections()}>
              <ClearSharpIcon />
            </IconButton>
          )}
        </ButtonGroup>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={plants}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={(newSelectionModel) => {
              const selections = [];
              newSelectionModel.forEach((index) => selections.push(plants[index]));
              console.log(selections);

              setSelectedPlants(selections);
            }}
          />
        </Box>
      </div>
      {isUpdatePlantFormOpen && (
        <UpdatePlantForm
          isOpen={isUpdatePlantFormOpen}
          onRequestClose={() => setIsUpdatePlantFormOpen(false)}
          setPlants={setPlants}
          plant={selectedPlants[0]}
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
      {isRepotPlantsFormOpen && (
        <RepotPlantsForm
          isOpen={isRepotPlantsFormOpen}
          onRequestClose={() => setIsRepotPlantsFormOpen(false)}
          setPlants={setPlants}
          plants={selectedPlants}
        />
      )}
    </>
  );
};

export default Plants;
