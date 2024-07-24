import React, { useState, useMemo } from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarExport, GridToolbarDensitySelector } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { EditSharp, WaterDropOutlined, DeleteOutlineSharp, LunchDining, ParkSharp } from '@mui/icons-material';
import UpdatePlantForm from '../../forms/update/UpdatePlantForm';
import WaterPlantsForm from '../../modals/plant/WaterPlantsForm';
import KillPlantsForm from '../../modals/plant/KillPlantsForm';
import FertilizePlantsForm from '../../forms/update/FertilizePlantsForm';
import RepotPlantsForm from '../../forms/update/RepotPlantsForm';
import { PHASE_LABELS } from '../../constants';
import { usePlants } from '../../hooks/usePlants';

const Plants = ({ initialPlants }) => {
  const { plants, setPlants, genuses, systems, types, isLoading, error } = usePlants(initialPlants);
  const [selectedPlants, setSelectedPlants] = useState([]);
  const [formStates, setFormStates] = useState({
    updatePlant: false,
    waterPlants: false,
    killPlants: false,
    fertilizePlants: false,
    repotPlants: false,
  });

  const columns = useMemo(() => [
    {
      field: 'type_id',
      headerName: 'Type',
      width: 150,
      valueGetter: ({ value }) => types.find(_t => _t.id === value)?.name || 'N/A',
    },
    {
      field: 'genus_id',
      headerName: 'Genus',
      width: 150,
      valueGetter: ({ value }) => genuses.find(_g => _g.id === value)?.name || 'N/A',
    },
    {
      field: 'system_id',
      headerName: 'System',
      width: 150,
      valueGetter: ({ value }) => systems.find(_s => _s.id === value)?.name || 'N/A',
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
  ], [types, genuses, systems]);

  const CustomToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
      <Box sx={{ flexGrow: 1 }} />
      {selectedPlants.length === 1 && (
        <IconButton size="small" color="primary" onClick={() => setFormStates(prev => ({ ...prev, updatePlant: true }))}>
          <EditSharp />
        </IconButton>
      )}
      {selectedPlants.length > 0 && (
        <>
          <IconButton size="small" color="info" onClick={() => setFormStates(prev => ({ ...prev, waterPlants: true }))}>
            <WaterDropOutlined />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => setFormStates(prev => ({ ...prev, killPlants: true }))}>
            <DeleteOutlineSharp />
          </IconButton>
          <IconButton size="small" color="info" onClick={() => setFormStates(prev => ({ ...prev, fertilizePlants: true }))}>
            <LunchDining />
          </IconButton>
          <IconButton size="small" color="info" onClick={() => setFormStates(prev => ({ ...prev, repotPlants: true }))}>
            <ParkSharp />
          </IconButton>
        </>
      )}
    </GridToolbarContainer>
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
            const newSelectedPlants = newSelectionModel.map(index => plants[index - 1]);
            setSelectedPlants(newSelectedPlants);
          }}
          slots={{ toolbar: CustomToolbar }}
        />
      </Box>

      {formStates.updatePlant && (
        <UpdatePlantForm
          isOpen={formStates.updatePlant}
          onRequestClose={() => setFormStates(prev => ({ ...prev, updatePlant: false }))}
          setPlants={setPlants}
          plant={selectedPlants[0]}
        />
      )}
      {formStates.waterPlants && (
        <WaterPlantsForm
          isOpen={formStates.waterPlants}
          onRequestClose={() => setFormStates(prev => ({ ...prev, waterPlants: false }))}
          initialPlants={selectedPlants}
        />
      )}
      {formStates.killPlants && (
        <KillPlantsForm
          isOpen={formStates.killPlants}
          onRequestClose={() => setFormStates(prev => ({ ...prev, killPlants: false }))}
          initialPlants={selectedPlants}
        />
      )}
      {formStates.fertilizePlants && (
        <FertilizePlantsForm
          isOpen={formStates.fertilizePlants}
          onRequestClose={() => setFormStates(prev => ({ ...prev, fertilizePlants: false }))}
          setPlants={setPlants}
          plants={selectedPlants}
        />
      )}
      {formStates.repotPlants && (
        <RepotPlantsForm
          isOpen={formStates.repotPlants}
          onRequestClose={() => setFormStates(prev => ({ ...prev, repotPlants: false }))}
          setPlants={setPlants}
          plants={selectedPlants}
        />
      )}
    </>
  );
};

export default Plants;