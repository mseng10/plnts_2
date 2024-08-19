import React from 'react';
import IconButton from '@mui/material/IconButton';
import IconFactory from './IconFactory';
import { Stack } from '@mui/material';
// import { useState } from 'react';
import Alert from '@mui/material/Alert';

const opacity = 0.7;

/** Server Error for full page view. */
export const ServerError = () => {
  return (
    <Stack sx={{opacity: opacity}} direction="column" alignItems="center" height={52}>
     <IconButton color="error">
        <IconFactory
          icon={"serverError"}
          color={"error"}
          size={"home_icon"}
        />
    </IconButton>
    <Alert variant="outlined" severity="error">
      Server Error.
    </Alert>
    </Stack>
    )
};

/** No data full page view. */
export const NoData = () => {
  return (
    <Stack sx={{opacity: opacity}} direction="column" alignItems="center" height={52}>
      <IconButton color="error">
          <IconFactory
            icon={"noData"}
            color={"primary"}
            size={"home_icon"}
          />
      </IconButton>
      <Alert variant="outlined" severity="primary">
        No Data:0
      </Alert>    
    </Stack>
    )
};

/** Loading data full page view. */
export const Loading = () => {
  // const [opacity, setOpacity] = useState(0.1);

  return (
    <Stack sx={{opacity: opacity}} direction="column" alignItems="center" height={52}>
     <IconButton color="error">
        <IconFactory
          icon={"loading"}
          color={"primary"}
          size={"home_icon"}
        />
    </IconButton>
    <h1>No Data :0</h1>
    </Stack>
    )
};