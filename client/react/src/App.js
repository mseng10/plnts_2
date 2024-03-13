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
import Home from './pages/Home';
import System from './pages/System'
import ButtonGroup from '@mui/material/ButtonGroup';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import SettingsSharpIcon from '@mui/icons-material/SettingsSharp';
import NewPlantForm from './forms/NewPlantForm';
import ArrowBackIosNewSharpIcon from '@mui/icons-material/ArrowBackIosNewSharp';
import FitnessCenterSharpIcon from '@mui/icons-material/FitnessCenterSharp';

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
  const [system, setSystem] = useState({ temperature: 20, humidity: 50 });
  const [isNewPlantFormOpen, setIsNewPlantFormOpen] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const [showNeedWater, setNeedWater] = useState(false);
  const [showSystem, setShowSystem] = useState(false);

  useEffect(() => {
    // Fetch plant data from the server
    fetch('https://localhost/plants')
      .then((response) => response.json())
      .then((data) => setPlants(data))
      .catch((error) => console.error('Error fetching plant data:', error));
    const system = {temperature: 20, humidity: 80};
    // Fetch plant data from the server
    fetch('https://localhost/system')
      .then((response) => response.json())
      .then(() => setSystem(system))
      .catch(() => setSystem(system));
  }, []);

  const openApp = () => {
    setShowHome(false);
    setShowSystem(false);
  };

  const openHome = (filtered_plants) => {
    setNeedWater(filtered_plants);
    setShowHome(true);
  };

  const openSystem = () => {
    setShowSystem(true);
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

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        {(showHome || showSystem) && ( // yuck
          <div>
            <IconButton id="back" size="large"  color="primary" onClick={() => openApp()}>
              <ArrowBackIosNewSharpIcon />
            </IconButton>
          </div>
        )}
        {!showHome && !showSystem && ( // yuck
          <div>
            <div className='system_min'>
              <System
                system = {system}
              />
            </div>
            <IconButton size="large" className={`home_icon`} color="primary" onClick={() => openHome(false)}>
              <GrassOutlinedIcon className='home_icon'/>
            </IconButton>
          </div>
        )}
        {!showHome && !showSystem && ( // yuck
          <ButtonGroup size="lg">
            <IconButton size="large" color="secondary" onClick={() => setIsNewPlantFormOpen(true)}>
              <AddSharpIcon className={`home_button `} />
            </IconButton>
            <IconButton size="large" color="error" onClick={() => openHome(true)}>
              <WaterDropOutlinedIcon className={`home_button `} />
            </IconButton>
            <IconButton size="large" sx={{color: '#9c27b0'}} color="info" onClick={() => openSystem()}>
              <FitnessCenterSharpIcon className={`home_button`} />
            </IconButton>
            <IconButton size="large" color="info" onClick={() => openSystem()}>
              <SettingsSharpIcon className={`home_button`} />
            </IconButton>
          </ButtonGroup>
        )}
        {showHome && (
          <Home
            plants={plants}
            onlyNeedWater={showNeedWater}
            handleKillPlant={handleKillPlant}
            setPlants={setPlants}
          />
        )}
        {showSystem && (
          <System
            system={system}
            full={showSystem}
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
