import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import System from './System';


const Systems = () => {
  const [systems, setSystems] = useState([]);

  useEffect(() => {
    // Fetch Systems data from the server
    fetch('http://127.0.0.1:5000/system')
      .then((response) => response.json())
      .then((data) => setSystems(data))
      .catch((error) => console.error('Error fetching system data:', error));
  }, []);

  return (
    <>
      <Grid item xs={12}>
        <Grid container justifyContent="center" spacing={4}>
          {systems.map((system) => (
            <Grid key={system} item>
              <System
                system={system}
                full={false}
                sx={{
                  height: 140,
                  width: 100,
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
};

export default Systems;
