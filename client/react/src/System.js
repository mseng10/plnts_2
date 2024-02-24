import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import DeviceThermostatSharpIcon from '@mui/icons-material/DeviceThermostatSharp';
import InvertColorsSharpIcon from '@mui/icons-material/InvertColorsSharp';

const System = ({ system }) => {
  if (!system) {
    // Handle case when system data is not available
    return <div>No system data available</div>;
  }
  

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
      <Box sx={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
        <CircularProgress
          variant="determinate"
          value={system.humidity}
          size={80}
          sx={{ color: '#3f51b5' }}
        />
        <InvertColorsSharpIcon sx={{color: '#3f51b5', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '48px' }} />
      </Box>      
      <Box sx={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
        <CircularProgress
          variant="determinate"
          value={system.temperature}
          size={80}
          sx={{ color: '#ffc107' }}
        />
        <DeviceThermostatSharpIcon sx={{ color: '#ffc107', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '48px' }} />
      </Box>
    </Box>
  );
};

export default System;
