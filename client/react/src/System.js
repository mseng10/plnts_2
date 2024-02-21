import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const System = ({ temperature, humidity }) => {
  console.log(temperature);
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
      {/* <CircularProgress color="warning">
        <WarningIcon color="warning" />
      </CircularProgress> */}
      <CircularProgress size="lg" determinate value={temperature}>
        2 / 3
      </CircularProgress>
      <CircularProgress size="lg" determinate value={humidity}>
        2 / 3
      </CircularProgress>
      {/* <CircularProgress color="danger" sx={{ '--CircularProgress-size': '80px' }}>
        <ReportIcon color="danger" />
      </CircularProgress> */}
    </Box>
  );
};

export default System;
