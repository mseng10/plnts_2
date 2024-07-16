import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Alerts from '../../pages/Alerts';

const SystemAlerts = ({ isOpen, system, onRequestClose }) => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (isOpen && system && system.system) {
      const url = 'http://127.0.0.1:5000/system/' + system.system.id.toString() + '/alerts'
      // Fetch plant data from the server
      fetch(url)
        .then((response) => response.json())
        .then((data) => setAlerts(data))
        .catch((error) => console.error('Error fetching plant data:', error));
    }
  }, [isOpen, system]);

  if (!system) {
    return (<div></div>);
  }

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
        <Alerts alerts={alerts}></Alerts>
      </Box>
    </Modal>
  );
};

export default SystemAlerts;
