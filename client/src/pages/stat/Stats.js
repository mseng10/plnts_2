import React from 'react';
import { useStats } from '../../hooks/useStats';
import Grid from '@mui/material/Grid';
import { Stack } from '@mui/system';
import IconFactory from '../../elements/IconFactory';
import { Loading, NoData, ServerError } from '../../elements/Page';

/** Stats Page. */
const Stats = () => {
    const { stats, isLoading, error } = useStats();
  
    if (isLoading) return <Loading/>;
    if (error) return <ServerError/>;
    if (!stats) return <NoData/>
  
    return (
    <Grid sx={{opacity: 0.7}} container justifyContent="center" spacing={4}>
      <Grid key={"active_plants"} item>
        <Stack direction="column" alignItems="center">
          <IconFactory
            icon={"plant"}
            size={"xxxlg"}
            color={"primary"}
          />
          <h1>{stats.total_active_plants}</h1>
        </Stack>
      </Grid>
      <Grid key={"active_systems"} item>
        <Stack direction="column" alignItems="center">
          <IconFactory
            icon={"system"}
            size={"xxxlg"}
            color={"primary"}
          />
          <h1>{stats.total_active_systems}</h1>
        </Stack>
      </Grid>
      <Grid key={"active_cost"} item>
        <Stack direction="column" alignItems="center">
          <IconFactory
            icon={"cost"}
            size={"xxxlg"}
            color={"primary"}
          />
          <h1>{stats.total_active_cost}</h1>
        </Stack>
      </Grid>
    </Grid>
    );
  };
  
  export default Stats;