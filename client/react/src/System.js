import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const System = ({ system }) => {
  if (!system) {
    // Handle case when system data is not available
    return <div>No system data available</div>;
  }
  

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
      {/* <CircularProgress color='primary' size="lg" determinate value={system.temperature} />
      <CircularProgress color='primary' size="lg" determinate value={system.humidity} /> */}
      <CircularProgress variant="determinate" value={system.temperature} />
      <CircularProgress variant="determinate" value={system.humidity} />
    </Box>
  );
};

export default System;
