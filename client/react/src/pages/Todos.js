// Todos.js
import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Todo from '../models/Todo';

const Todos = () => {

  // Passable Data
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // Fetch Systems data from the server
    fetch('http://127.0.0.1:5000/todo')
      .then((response) => response.json())
      .then((data) => setTodos(data))
      .catch((error) => console.error('Error fetching system data:', error));
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
                  <Todo
                    todo={todo}
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
        </div>
        {/* )} */}
      </div>
    </>
  );
};

export default Todos;
