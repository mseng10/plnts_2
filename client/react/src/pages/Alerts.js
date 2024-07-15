// Todos.js
import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea, CardHeader } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import CardActions from '@mui/material/CardActions';
import ReportGmailerrorredSharpIcon from '@mui/icons-material/ReportGmailerrorredSharp';
// import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Alerts = () => {

  // Passable Data
  const [plantAlerts, setPlantAlerts] = useState([]);

  const [resolve, setResolve] = useState(null);

  useEffect(() => {
    if (resolve) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      };
      const endpoint = 'http://127.0.0.1:5000/alert/plant/' + resolve.id + "/resolve"
      fetch(endpoint, requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log(data);

          setTimeout(() => {
            const updatePlantAlerts = plantAlerts.filter((_pa => _pa.id !== resolve.id))
            setPlantAlerts(updatePlantAlerts);
          }, 1000);

          setResolve(null);
        })
        .catch(error => console.error('Error posting todo data:', error));
    }
  }, [resolve]);

  useEffect(() => {
    // Fetch Systems data from the server
    fetch('http://127.0.0.1:5000/alert/check')
      .then((response) => response.json())
      .then((data) => setPlantAlerts(data))
      .catch((error) => console.error('Error fetching alert data:', error));
  }, []);

  return (
    <>
      <div className="App">
        {/* { todos.length > 0 && ( */}
        <div>
          <Grid item xs={12}>
            <Grid container justifyContent="center" spacing={4}>
              {plantAlerts.map((plantAlert) => (
                <Grid key={plantAlert} item>
                  <Card sx={{ maxWidth: 345 }}>
                    <CardActionArea>
                      <CardHeader
                        avatar={
                          <Avatar aria-label="recipe" sx={{backgroundColor:'inherit'}}>
                            <ReportGmailerrorredSharpIcon className="medium_button" color='alert'/>
                          </Avatar>
                        }
                        title={plantAlert.alert_type}
                        subheader={plantAlert.created_on}
                      />
                      <CardContent>
                        <Box full>
                          {/* <Typography variant="body2" color="text.secondary">
                            {plantAlert.description}
                          </Typography> */}
                        </Box>
                      </CardContent>
                      <CardActions disableSpacing>
                        <IconButton color="info" onClick={() => setResolve(plantAlert)}>
                          <CheckCircleOutlineIcon />
                        </IconButton>
                      </CardActions>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </div>
        {/* )} */}
      </div>
    </>
  );
};

export default Alerts;
