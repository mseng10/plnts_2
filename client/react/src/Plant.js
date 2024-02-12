import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const Plant = ({ name, type, wateringFrequency, lastWatered, alive, onKill, onWater, onUpdate }) => {
  return (
    <Card className={`plant ${alive ? 'alive' : 'not-alive'}`}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {name}
        </Typography>
        {alive && (
          <>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Type: {type}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Watering Frequency: {wateringFrequency}
            </Typography>
            {lastWatered && (
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Last Watered: {lastWatered}
              </Typography>
            )}
            <div>
              <IconButton color="secondary" onClick={onWater}>
                <WaterDropOutlinedIcon />
              </IconButton>
              <IconButton color="error" onClick={onKill}>
                <DeleteOutlineOutlinedIcon />
              </IconButton>
              <IconButton color="secondary" onClick={onUpdate}>
                <EditOutlinedIcon />
              </IconButton>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Plant;
