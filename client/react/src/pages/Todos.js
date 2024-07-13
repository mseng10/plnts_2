// Alerts.js
import React, { useState, useEffect } from 'react';

const Todos = () => {

  // Passable Data
  const [todos, setTodos] = useState([]);

  console.log(todos);

  useEffect(() => {
    // Fetch system data from the server
    fetch('http://localhost:5000/todos')
      .then((response) => response.json())
      .then((data) => setTodos(data))
      .catch(() => console.log("Oh no"));
  }, []);

  return (
    <>
      <div className="App">
        <div>
        </div>
      </div>
    </>
  );
};

export default Todos;
