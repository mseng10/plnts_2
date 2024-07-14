// Plants.js
import React, { useState, useEffect } from 'react';
import UpdatePlantForm from '../forms/update/UpdatePlantForm';
import WaterPlantsForm from '../forms/update/WaterPlantsForm';
import FertilizePlantsForm from '../forms/update/FertilizePlantsForm';
import RepotPlantsForm from '../forms/update/RepotPlantsForm';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineSharpIcon from '@mui/icons-material/DeleteOutlineSharp';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import KillPlantsForm from '../forms/update/KillPlantsForm';
import ParkSharpIcon from '@mui/icons-material/ParkSharp';
import { DataGrid,GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector, } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

const Plants = () => {

  const [plants, setPlants] = useState([]);
  const [genuses, setGensuses] = useState([]);
  const [systems, setSystems] = useState([]);
  const [types, setTypes] = useState([]);

  const columns = [
    {
      field: 'type_id',
      headerName: 'Type',
      width: 150,
      editable: false,
      valueGetter: (value) => {
        if (!value) {
          return "Nan";
        }
        const typeObj = types.find(_t => _t.id == value.value)
        
        return typeObj ? typeObj.name : "Nan";
      },
    },
    {
      field: 'genus_id',
      headerName: 'Genus',
      width: 150,
      editable: false,
      valueGetter: (value) => {
        if (!value) {
          return "Nan";
        }
        const genusObj = genuses.find(_g => _g.id == value.value)
        
        return genusObj ? genusObj.name : "Nan";
      },
    },
    {
      field: 'system_id',
      headerName: 'System',
      width: 150,
      editable: false,
      valueGetter: (value) => {
        if (!value) {
          return "Nan";
        }
        const systemObj = systems.find(_s => _s.id == value.value)
        
        return systemObj ? systemObj.name : "Nan";
      },
    },
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
      field: 'watering',
      headerName: 'Watering',
      type: 'number',
      width: 100,
      editable: false,
    },
    {
      field: 'phase',
      headerName: 'Phase',
      width: 60,
    },
  ];

  const [isUpdatePlantFormOpen, setIsUpdatePlantFormOpen] = useState(false);
  const [isWaterPlantsFormOpen, setIsWaterPlantsFormOpen] = useState(false);
  const [isKillPlantsFormOpen, setIsKillPlantsFormOpen] = useState(false);
  const [isFertilizePlantsFormOpen, setIsFertilizePlantsFormOpen] = useState(false);
  const [isRepotPlantsFormOpen, setIsRepotPlantsFormOpen] = useState(false);
  const [selectedPlants, setSelectedPlants] = useState([]);


  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector
          slotProps={{ tooltip: { title: 'Change density' } }}
        />
        <GridToolbarExport
          slotProps={{
            tooltip: { title: 'Export data' },
            button: { variant: 'outlined' },
          }}
        />
        <Box sx={{ flexGrow: 1 }} />
        {selectedPlants.length === 1 && (
          <IconButton size="small" color="primary" onClick={() => setIsUpdatePlantFormOpen(true)}>
            <EditSharpIcon />
          </IconButton>
        )}
        {selectedPlants.length > 0 && (
          <IconButton size="small" color="secondary" onClick={() => setIsWaterPlantsFormOpen(true)}>
            <WaterDropOutlinedIcon />
          </IconButton>
        )}
        {selectedPlants.length > 0 && (
          <IconButton size="small" color="error" onClick={() => setIsKillPlantsFormOpen(true)}>
            <DeleteOutlineSharpIcon />
          </IconButton>
        )}
        {selectedPlants.length > 0 && (
          <IconButton size="small" sx={{color: '#009688'}} onClick={() => setIsFertilizePlantsFormOpen(true)}>
            <LunchDiningIcon />
          </IconButton>
        )}          
        {selectedPlants.length > 0 && (
          <IconButton size="small" color='repot' onClick={() => setIsRepotPlantsFormOpen(true)}>
            <ParkSharpIcon />
          </IconButton>
        )}
      </GridToolbarContainer>
    );
  }

  useEffect(() => {
    // TODO: Merge plants, genus, type to same model
    // Fetch plant data from the server
    fetch('http://127.0.0.1:5000/plants')
      .then((response) => response.json())
      .then((data) => setPlants(data))
      .catch((error) => console.error('Error fetching plant data:', error));
    // Fetch genus data from the server
    fetch('http://127.0.0.1:5000/genus')
      .then((response) => response.json())
      .then((data) => setGensuses(data))
      .catch((error) => console.error('Error fetching genus data:', error));
    // Fetch System data from the server
    fetch('http://127.0.0.1:5000/system')
      .then((response) => response.json())
      .then((data) => setSystems(data))
      .catch((error) => console.error('Error fetching system data:', error));
    fetch('http://127.0.0.1:5000/type')
      .then((response) => response.json())
      .then((data) => setTypes(data))
      .catch((error) => console.error('Error fetching type data:', error));
  }, []);

  return (
    <>
      <div>
        <Box sx={{ height: '100%', width: '100%' }}>
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
              newSelectionModel.forEach((index) => {
                const actualIndex = index -=1;
                selections.push(plants[actualIndex])
              
              });
              setSelectedPlants(selections);
            }}
            slots={{
              toolbar: CustomToolbar,
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
