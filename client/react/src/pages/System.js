import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import DeviceThermostatSharpIcon from '@mui/icons-material/DeviceThermostatSharp';
import InvertColorsSharpIcon from '@mui/icons-material/InvertColorsSharp';
import TungstenSharpIcon from '@mui/icons-material/TungstenSharp';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea, CardHeader } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';
import { green } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import ReportGmailerrorredSharpIcon from '@mui/icons-material/ReportGmailerrorredSharp';
import CardActions from '@mui/material/CardActions';

const System = ({ system, full }) => {
  if (!system) {
    // Handle case when system data is not available
    return <div>No system data available</div>;
  }
  else if (full) {
    return (
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <Box sx={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress
            variant="determinate"
            value={system.humidity}
            size={256}
            sx={{ color: '#3f51b5' }}
          />
          <InvertColorsSharpIcon sx={{color: '#3f51b5', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '128px' }} />
        </Box>      
        <Box sx={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress
            variant="determinate"
            value={system.temperature}
            size={256}
            sx={{ color: '#ff9800' }}
          />
          <DeviceThermostatSharpIcon sx={{ color: '#ff9800', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '128px' }} />
        </Box>
        <Box sx={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress
            variant="determinate"
            value={system.temperature}
            size={256}
            sx={{ color: '#ffeb3b' }}
          />
          <TungstenSharpIcon sx={{ color: '#ffeb3b', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '128px' }} />
        </Box>
      </Box>
    );
  }

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: green[500] }} aria-label="recipe">
              <GrassOutlinedIcon/>
            </Avatar>
          }
          title={system.name}
          subheader={system.created_on}
        />
        <CardContent>
          <Box full>
            <Box sx={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
              <CircularProgress
                variant="determinate"
                value={system.humidity}
                size={80}
                sx={{ color: '#3f51b5' }}
              />
              <InvertColorsSharpIcon sx={{color: '#3f51b5', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '32px' }} />
            </Box>      
            <Box sx={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
              <CircularProgress
                variant="determinate"
                value={system.temperature}
                size={80}
                sx={{ color: '#ff9800' }}
              />
              <DeviceThermostatSharpIcon sx={{ color: '#ff9800', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '32px' }} />
            </Box>
            <Box sx={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
              <CircularProgress
                variant="determinate"
                value={system.temperature}
                size={80}
                sx={{ color: '#ffeb3b' }}
              />
              <TungstenSharpIcon sx={{ color: '#ffeb3b', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '32px' }} />
            </Box>
          </Box>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton color="info">
            <ReportGmailerrorredSharpIcon />
          </IconButton>
          <IconButton color="info">
            <GrassOutlinedIcon />
          </IconButton>
        </CardActions>
      </CardActionArea>
    </Card>
  );
};

export default System;
