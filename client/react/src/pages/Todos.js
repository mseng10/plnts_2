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
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Todos = () => {

  // Passable Data
  const [todos, setTodos] = useState([]);

  const [resolve, setResolve] = useState(null);

  useEffect(() => {
    if (resolve) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      };
      const endpoint = 'http://127.0.0.1:5000/todo/' + resolve.id + "/resolve"
      fetch(endpoint, requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log(data);

          setTimeout(() => {
            const updatedTodos = todos.filter((_t => _t.id !== resolve.id))
            setTodos(updatedTodos);
          }, 1000);

          setResolve(null);
        })
        .catch(error => console.error('Error posting todo data:', error));
    }
  }, [resolve]);

  useEffect(() => {
    // Fetch Systems data from the server
    fetch('http://127.0.0.1:5000/todo')
      .then((response) => response.json())
      .then((data) => setTodos(data))
      .catch((error) => console.error('Error fetching todo data:', error));
  }, []);

  return (
    <>
      <div className="App">
        {/* { todos.length > 0 && ( */}
        <div>
          <Grid item xs={12}>
            <Grid container justifyContent="center" spacing={4}>
              {todos.map((todo) => (
                <Grid key={todo} item>
                  <Card sx={{ maxWidth: 345 }}>
                    <CardActionArea>
                      <CardHeader
                        avatar={
                          <Avatar aria-label="recipe" sx={{backgroundColor:'inherit'}}>
                            <FormatListNumberedIcon color='lime'/>
                          </Avatar>
                        }
                        title={todo.name}
                        subheader={todo.created_on}
                      />
                      <CardContent>
                        <Box full>
                          <Typography variant="body2" color="text.secondary">
                            {todo.description}
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardActions disableSpacing>
                        <IconButton color="info" onClick={() => setResolve(todo)}>
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

export default Todos;
