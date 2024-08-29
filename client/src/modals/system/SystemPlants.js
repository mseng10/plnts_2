import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Plants from '../../pages/plant/Plants';
import { useSystemsPlants } from '../../hooks/useSystems';
import { MODAL_STYLE } from '../../constants';
import { ServerError, NoData } from '../../elements/Page';

/** View all plants for a system in a modal. */
const SystemPlants = ({ isOpen, system, onRequestClose }) => {
  const { plants, isLoading, error } = useSystemsPlants(system);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <ServerError/>;
  if (plants.length === 0) return <NoData/>;

  return (
    <Modal
      open={isOpen}
      onClose={onRequestClose}
      disableAutoFocus={true}
      style={MODAL_STYLE}
    >
      <Box sx={{ width: 756, height: 512, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Plants initialPlants={plants}></Plants>
      </Box>
    </Modal>
  );
};

export default SystemPlants;
