// Systems.js
import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
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
import IconButton from '@mui/material/IconButton';
import ReportGmailerrorredSharpIcon from '@mui/icons-material/ReportGmailerrorredSharp';
import CardActions from '@mui/material/CardActions';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import SystemPlants from '../../modals/system/SystemPlants';
import SystemAlerts from '../../modals/system/SystemAlerts';
import { useSystems } from '../../hooks/useSystems';
import { CARD_STYLE, AVATAR_STYLE, CIRCULAR_PROGRESS_STYLE, ICON_STYLE } from '../../constants';
import { EditSharp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {deprecateSystem} from '../../api'
import DeleteOutlineSharpIcon from '@mui/icons-material/DeleteOutlineSharp';

const SystemCard = ({ system }) => {
  const navigate = useNavigate();
  const [isSystemsPlanetsOpen, setIsSystemsPlanetsOpen] = useState(false);
  const [isSystemAlertsOpen, setIsSystemsAlertsOpen] = useState(false);

  return (
    <>
      <Card sx={CARD_STYLE}>
        <CardActionArea>
          <CardHeader
            avatar={
              <Avatar sx={AVATAR_STYLE}>
                <PointOfSaleIcon className="small_button" color='info'/>
              </Avatar>
            }
            title={system.name}
            subheader={system.created_on}
          />
          <CardContent>
            <Box full>
              <Box sx={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', width:100 }}>
                <CircularProgress
                  variant="determinate"
                  value={system.humidity}
                  size={80}
                  sx={CIRCULAR_PROGRESS_STYLE}
                />
                <InvertColorsSharpIcon sx={ICON_STYLE} />
              </Box>      
              <Box sx={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', width:100 }}>
                <CircularProgress
                  variant="determinate"
                  value={system.temperature}
                  size={80}
                  sx={CIRCULAR_PROGRESS_STYLE}
                />
                <DeviceThermostatSharpIcon sx={ICON_STYLE} />
              </Box>
              <Box sx={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', width:100 }}>
                <CircularProgress
                  variant="determinate"
                  value={system.light}
                  size={80}
                  sx={CIRCULAR_PROGRESS_STYLE}
                />
                <TungstenSharpIcon sx={ICON_STYLE} />
              </Box>
            </Box>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton color="info" onClick={() => navigate(`/system/${system.id}`)}>
              <EditSharp />
            </IconButton>
            <IconButton color="info" onClick={() => setIsSystemsAlertsOpen(true)}>
              <ReportGmailerrorredSharpIcon />
            </IconButton>
            <IconButton color="info" onClick={() => setIsSystemsPlanetsOpen(true)}>
              <GrassOutlinedIcon />
            </IconButton>
            <IconButton color="error" onClick={() => deprecateSystem(system.id)}>
              <DeleteOutlineSharpIcon />
            </IconButton>
          </CardActions>
        </CardActionArea>
      </Card>
      {isSystemsPlanetsOpen && (
        <SystemPlants
          isOpen={isSystemsPlanetsOpen}
          onRequestClose={() => setIsSystemsPlanetsOpen(false)}
          system={system}
        />
      )}
      {isSystemAlertsOpen && (
        <SystemAlerts
          isOpen={isSystemAlertsOpen}
          onRequestClose={() => setIsSystemsAlertsOpen(false)}
          system={system}
        />
      )}
    </>
  );
};

const Systems = () => {
  const { systems, isLoading, error } = useSystems();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (systems.length === 0) return <div>No Systems!</div>;

  return (
    <Grid container justifyContent="center" spacing={4}>
      {systems.map((system) => (
        <Grid key={system.id} item>
          <SystemCard system={system} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Systems;