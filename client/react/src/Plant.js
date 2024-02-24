import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';


const Plant = ({ name, type, genus, wateringFrequency, lastWatered, alive, onSelect, onKill, onWater, onUpdate }) => {
  
  const handleSelect = (plant) => {

    onSelect(plant);
  };

  return (
    <Card className={`plant ${alive ? 'alive' : 'not-alive'}`} border={1} borderColor="primary" onClick= {() => handleSelect(null)}>
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
              Genus: {genus}
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
