import React from 'react';
import { useStats } from '../../hooks/useStats';
import Grid from '@mui/material/Grid';
import { Stack } from '@mui/system';
import IconFactory from '../../elements/IconFactory';

const Stats = () => {
    const { stats, isLoading, error } = useStats();
  
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!stats) return <div>No Stats!</div>;
  
    return (
    <Grid container justifyContent="center" spacing={4}>
        <Grid key={"active_plants"} item>
          <Stack direction="column" alignItems="center" height={52}>
            <IconFactory
              icon={"plant"}
              size={"xlg"}
              color={"primary"}
            />
            <h1>{stats.total_active_plants}</h1>
          </Stack>
        </Grid>

      <Grid key={"active_systems"} item>

      <Stack direction="column" alignItems="center" height={52}>
        <IconFactory
          icon={"system"}
          size={"xlg"}
          color={"primary"}
        />
        <h1>{stats.total_active_systems}</h1>
      </Stack>
      </Grid>
<Grid key={"active_cost"} item>
      <Stack direction="column" alignItems="center" height={52}>
        <IconFactory
          icon={"cost"}
          size={"xlg"}
          color={"primary"}
        />
        <h1>{stats.total_active_cost}</h1>
      </Stack>
      </Grid>

    </Grid>
    );
  };
  
  export default Stats;