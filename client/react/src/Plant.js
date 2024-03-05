import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';


const Plant = ({ name, type, genus, wateringFrequency, lastWatered, alive }) => {

  return (
    <Card className={`plant ${alive ? 'alive' : 'not-alive'}`} border={1} borderColor="primary" >
      <CardContent>
        <Typography variant="h5" >
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
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Plant;
