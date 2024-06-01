import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { green, pink, lightBlue, blueGrey, teal, brown } from '@mui/material/colors';
import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';
import Plants from './pages/Plants';
import System from './pages/System'
import ButtonGroup from '@mui/material/ButtonGroup';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import NewPlantForm from './forms/NewPlantForm';
import NewGenusForm from './forms/NewGenusForm';
import ArrowBackIosNewSharpIcon from '@mui/icons-material/ArrowBackIosNewSharp';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import ParkSharpIcon from '@mui/icons-material/ParkSharp';
import FingerprintSharpIcon from '@mui/icons-material/FingerprintSharp';
import CallSplitSharpIcon from '@mui/icons-material/CallSplitSharp';
import NewSpeciesForm from './forms/NewSpeciesForm';

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
    fertilize: {
      main: teal[500],
    },
    repot: {
      main: brown[500],
    }
  },
});

const App = () => {
  const [plants, setPlants] = useState([]);
  const [system, setSystem] = useState({ temperature: 20, humidity: 50 });
  const [isNewPlantFormOpen, setIsNewPlantFormOpen] = useState(false);
  const [isNewSpeciesFormOpen, setIsNewSpeciesFormOpen] = useState(false);
  const [isNewGenusFormOpen, setIsNewGenusFormOpen] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const [showNeedWater, setNeedWater] = useState(false);
  const [showSystem, setShowSystem] = useState(false);

  useEffect(() => {
    // Fetch plant data from the server
    fetch('http://127.0.0.1:5000/plants')
      .then((response) => response.json())
      .then((data) => setPlants(data))
      .catch((error) => console.error('Error fetching plant data:', error));
    const system = {temperature: 20, humidity: 80};
    // Fetch plant data from the server
    fetch('http://localhost:5000/system')
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

  const handleKillPlant = (plantId) => {
    // Mark the plant as no longer active (alive: false)
    setPlants((prevPlants) =>
      prevPlants.map((plant) => (plant.id === plantId ? { ...plant, alive: false } : plant))
    );
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plants" element={<Plants />} />
        <Route path="/system" element={<System />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
