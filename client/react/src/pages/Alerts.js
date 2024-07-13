// Alerts.js
import React, { useState, useEffect } from 'react';

const Alerts = () => {

  // Passable Data
  const [alerts, setAlerts] = useState([]);

  console.log(alerts);

  useEffect(() => {
    // Fetch system data from the server
    fetch('http://localhost:5000/alerts')
      .then((response) => response.json())
      .then((data) => setAlerts(data))
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

export default Alerts;
