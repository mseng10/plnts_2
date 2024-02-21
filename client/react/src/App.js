import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { green, pink, lightBlue, blueGrey } from '@mui/material/colors';
import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';
import Home from './Home';
import System from './System'
import ButtonGroup from '@mui/material/ButtonGroup';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import SettingsSharpIcon from '@mui/icons-material/SettingsSharp';
import NewPlantForm from './forms/NewPlantForm';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: green[500],
    },
    secondary: {
      main: lightBlue[500],
    },
    info: {
      main: blueGrey[500],
    },
    error: {
      main: pink[500],
    },
  },
});

const App = () => {
  const [plants, setPlants] = useState([]);
  const [system, setSystem] = useState({temperature: 20, humidity: 80});
  const [isNewPlantFormOpen, setIsNewPlantFormOpen] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const [showNeedWater, setNeedWater] = useState(false);

  useEffect(() => {
    // Fetch plant data from the server
    fetch('https://localhost')
      .then((response) => response.json())
      .then((data) => setPlants(data))
      .catch((error) => console.error('Error fetching plant data:', error));

    // Fetch plant data from the server
    fetch('https://localhost')
      .then((response) => response.json())
      .then((data) => setSystem(data ? {temperature: 20, humidity: 80} : {temperature: 20, humidity: 80}))
      .catch(() => setSystem({temperature: 20, humidity: 80}));
  }, []);

  const openHome = (filtered_plants) => {
    setNeedWater(filtered_plants);
    setShowHome(true);
  };

  const handleSavePlant = (newPlant) => {
    // Add the "alive" field with a default value of true
    const plantWithAliveField = { ...newPlant, alive: true };

    // Save the new plant data to the server or perform other actions
    setPlants((prevPlants) => [...prevPlants, { id: Date.now(), lastWatered: Date.now(), ...plantWithAliveField }]);
    setIsNewPlantFormOpen(false);
  };

  const handleKillPlant = (plantId) => {
    // Mark the plant as no longer active (alive: false)
    setPlants((prevPlants) =>
      prevPlants.map((plant) => (plant.id === plantId ? { ...plant, alive: false } : plant))
    );
  };

  const handleWaterPlant = (plantId) => {
    // Find the plant by id and update its lastWatered field to the current date and time
    setPlants((prevPlants) =>
      prevPlants.map((plant) =>
        plant.id === plantId ? { ...plant, lastWatered: new Date().toLocaleString() } : plant
      )
    );
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        {!showHome && (
          <div>
            {system != null && (
              <System
                {...system}
              />
            )}
            <IconButton size="large" className={`home_icon`} color="primary" onClick={() => openHome(false)}>
              <GrassOutlinedIcon className='home_icon'/>
            </IconButton>
          </div>
        )}
        {!showHome && (
          <ButtonGroup size="lg">
            <IconButton size="large" color="secondary" onClick={() => setIsNewPlantFormOpen(true)}>
              <AddSharpIcon className={`home_button `} />
            </IconButton>
            <IconButton size="large" color="error" onClick={() => openHome(true)}>
              <WaterDropOutlinedIcon className={`home_button `} />
            </IconButton>
            <IconButton size="large" color="info" onClick={() => setIsNewPlantFormOpen(true)}>
              <SettingsSharpIcon className={`home_button`} />
            </IconButton>
            <System
              system={system}
            />
          </ButtonGroup>
        )}
        {showHome && (
          <Home
            plants={plants}
            onlyNeedWater={showNeedWater}
            handleKillPlant={handleKillPlant}
            handleWaterPlant={handleWaterPlant}
          />
        )}
        <NewPlantForm
          isOpen={isNewPlantFormOpen}
          onRequestClose={() => setIsNewPlantFormOpen(false)}
          onSave={handleSavePlant}
        />
      </div>
    </ThemeProvider>
  );
};

export default App;
