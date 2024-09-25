import React, { useState, useMemo } from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarExport, GridToolbarDensitySelector } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { EditSharp, WaterDropOutlined, DeleteOutlineSharp } from '@mui/icons-material';
import WaterPlantsForm from '../../modals/plant/WaterPlantsForm';
import DeprecatePlantsForm from '../../modals/plant/DeprecatePlantsForm';
import { PHASE_LABELS } from '../../constants';
import { usePlants, useSpecies } from '../../hooks/usePlants';
import { useNavigate } from "react-router-dom";
import { ServerError, NoData, Loading} from '../../elements/Page';
import { useMixes } from '../../hooks/useMix';

const Plants = ({ initialPlants }) => {
  const navigate = useNavigate();
  const { plants, systems, isLoading, error } = usePlants(initialPlants);
  const {species} = useSpecies();
  const {mixes} = useMixes();
  const [selectedPlants, setSelectedPlants] = useState([]);
  const [formStates, setFormStates] = useState({
    updatePlant: false,
    waterPlants: false,
    deprecatePlants: false
  });

  const columns = useMemo(() => [
    {
      field: 'species_id',
      headerName: 'Type',
      width: 150,
      valueGetter: ({ value }) => species.find(_s => _s.id === value)?.name || 'N/A',
    },
    {
      field: 'system_id',
      headerName: 'System',
      width: 150,
      valueGetter: ({ value }) => systems.find(_s => _s.id === value)?.name || 'N/A',
    },
    {
      field: 'mix_id',
      headerName: 'Mix',
      width: 150,
      valueGetter: ({ value }) => mixes.find(_m => _m.id === value)?.name || 'N/A',
    },
    { field: 'size', headerName: 'Size', width: 20 },
    { field: 'cost', headerName: 'Cost', type: 'number', width: 20 },
    { field: 'created_on', headerName: 'Created On', width: 150 },
    { field: 'watered_on', headerName: 'Watered On', width: 150 },
    { field: 'watering', headerName: 'Watering', type: 'number', width: 100 },
    {
      field: 'phase',
      headerName: 'Phase',
      width: 120,
      valueGetter: ({ value }) => PHASE_LABELS[value] || 'N/A',
    },
  ], [species, mixes, systems]);

  const CustomToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
      <Box sx={{ flexGrow: 1 }} />
      {selectedPlants.length === 1 && (
        <IconButton size="small" color="primary" onClick={() => navigate(`/plants/${selectedPlants[0].id}`, { plantProp: selectedPlants[0] })}>
          <EditSharp />
        </IconButton>
      )}
      {selectedPlants.length > 0 && (
        <>
          <IconButton size="small" color="info" onClick={() => setFormStates(prev => ({ ...prev, waterPlants: true }))}>
            <WaterDropOutlined />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => setFormStates(prev => ({ ...prev, deprecatePlants: true }))}>
            <DeleteOutlineSharp />
          </IconButton>
        </>
      )}
    </GridToolbarContainer>
  );

  if (isLoading) return <Loading/>;
  if (error) return <ServerError/>;
  if (plants.length === 0) return <NoData/>;

  return (
    <>
      <Box sx={{ height: '100%', width: '100%' }}>
        <DataGrid
          rows={plants}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={(newSelectionModel) => {
            console.log(newSelectionModel);
            const newSelectedPlants = newSelectionModel.map(index => plants[index - 2]); // why
            console.log(newSelectedPlants)
            setSelectedPlants(newSelectedPlants);
          }}
          slots={{ toolbar: CustomToolbar }}
        />
      </Box>
      {formStates.waterPlants && (
        <WaterPlantsForm
          isOpen={formStates.waterPlants}
          onRequestClose={() => setFormStates(prev => ({ ...prev, waterPlants: false }))}
          initialPlants={selectedPlants}
        />
      )}
      {formStates.deprecatePlants && (
        <DeprecatePlantsForm
          isOpen={formStates.deprecatePlants}
          onRequestClose={() => setFormStates(prev => ({ ...prev, deprecatePlants: false }))}
          initialPlants={selectedPlants}
        />
      )}
    </>
  );
};

export default Plants;