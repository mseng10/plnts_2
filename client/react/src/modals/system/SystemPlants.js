import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Plants from '../../pages/plant/Plants';
import { useSystemsPlants } from '../../hooks/useSystems';

const SystemPlants = ({ isOpen, system, onRequestClose }) => {
  const { plants, isLoading, error } = useSystemsPlants(system);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (plants.length === 0) return <div>No Systems!</div>;

  return (
    <Modal
      open={isOpen}
      onClose={onRequestClose}
      disableAutoFocus={true}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'inherit',
        border: 'none',
      }}
    >
      <Box sx={{ width: 756, height: 512, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Plants initialPlants={plants}></Plants>
      </Box>
    </Modal>
  );
};

export default SystemPlants;
