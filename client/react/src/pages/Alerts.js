// Alerts.js
import React, { useState, useEffect } from 'react';

const Alerts = () => {

  // Passable Data
  const [alerts, setAlerts] = useState([]);

  console.log(alerts);

  useEffect(() => {
    // Fetch system data from the server
    fetch('http://127.0.0.1:5000/alert')
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
