// import React from 'react';
// import Modal from '@mui/material/Modal';
// import Box from '@mui/material/Box';
// import Alerts from '../../pages/alert/Alerts';
// import { useSystemAlerts } from '../../hooks/useSystems';
// import { MODAL_STYLE } from '../../constants';
// import { ServerError, NoData } from '../../elements/Page';

// /** View all alerts for a system in a modal. */
// const SystemAlerts = ({ isOpen, system, onRequestClose }) => {
//   const { alerts, isLoading, error } = useSystemAlerts(system);

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <ServerError/>;
//   if (alerts.length === 0) return <NoData/>;

//   return (
//     <Modal
//       open={isOpen}
//       onClose={onRequestClose}
//       disableAutoFocus={true}
//       style={MODAL_STYLE}
//     >
//       <Box sx={{ width: 756, height: 512, bgcolor: 'background.paper', borderRadius: 2 }}>
//         <Alerts alerts={alerts}></Alerts>
//       </Box>
//     </Modal>
//   );
// };

// export default SystemAlerts;
