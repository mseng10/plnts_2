// Home.js
import React, { useState } from 'react';
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



const Plants = ({
  plants,
  setPlants,
  // onlyNeedWater,
  // handleKillPlant,
}) => {

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    // {
    //   field: 'name',
    //   headerName: 'First name',
    //   width: 150,
    //   editable: false,
    // },
    {
      field: 'size',
      headerName: 'Size',
      width: 110,
      editable: false,
    },
    {
      field: 'cost',
      headerName: 'Cost',
      type: 'number',
      width: 110,
      editable: false,
    },
    // {
    //   field: 'fullName',
    //   headerName: 'Full name',
    //   description: 'This column has a value getter and is not sortable.',
    //   sortable: false,
    //   width: 160,
    //   valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    // },
  ];

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
            <IconButton size="large" color='repot' onClick={() => setIsRepotPlantsFormOpen(true)}>
              <ParkSharpIcon />
            </IconButton>
          )}
          {plants.filter(pl => pl.selected).length === 1 && (
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
