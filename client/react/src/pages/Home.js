// Home.js
import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';
import Plants from './Plants';
import System from './System'
import ButtonGroup from '@mui/material/ButtonGroup';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import NewPlantForm from '../forms/NewPlantForm';
import NewGenusForm from '../forms/NewGenusForm';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import ParkSharpIcon from '@mui/icons-material/ParkSharp';
import FingerprintSharpIcon from '@mui/icons-material/FingerprintSharp';
import CallSplitSharpIcon from '@mui/icons-material/CallSplitSharp';
import NewSpeciesForm from '../forms/NewSpeciesForm';
import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';



const Home = () => {
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
    <>
      <div className="App">
        {!showHome && !showSystem && ( // yuck
          <div>
            <div className='system_min' onClick={() => openSystem()}>
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
            <IconButton size="large" color="secondary" onClick={() => setIsNewSpeciesFormOpen(true)}>
              <CallSplitSharpIcon className={`home_button `} />
            </IconButton>
            <IconButton size="large" color="secondary" onClick={() => setIsNewGenusFormOpen(true)}>
              <FingerprintSharpIcon className={`home_button `} />
            </IconButton>
            <IconButton size="large" color="error" onClick={() => openHome(true)}>
              <WaterDropOutlinedIcon className={`home_button `} />
            </IconButton>
            <IconButton size="large" color="fertilize" onClick={() => openSystem()}>
              <LunchDiningIcon className={`home_button`} />
            </IconButton>
            <IconButton size="large" color='repot' onClick={() => openSystem()}>
              <ParkSharpIcon className={`home_button`} />
            </IconButton>
          </ButtonGroup>
        )}
        {showHome && (
          <Plants
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
        />
        <NewSpeciesForm
          isOpen={isNewSpeciesFormOpen}
          onRequestClose={() => setIsNewSpeciesFormOpen(false)}
        />
        <NewGenusForm
          isOpen={isNewGenusFormOpen}
          onRequestClose={() => setIsNewGenusFormOpen(false)}
        />
      </div>
    </>
  );
};

export default Home;
