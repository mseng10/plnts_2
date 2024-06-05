// Home.js
import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';
import System from './System'
import ButtonGroup from '@mui/material/ButtonGroup';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import NewPlantForm from '../forms/NewPlantForm';
import NewGenusForm from '../forms/NewGenusForm';
import NewSystemForm from '../forms/NewSystemForm';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import ParkSharpIcon from '@mui/icons-material/ParkSharp';
import FingerprintSharpIcon from '@mui/icons-material/FingerprintSharp';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import {useNavigate} from "react-router-dom" 



const Home = () => {
  // Navigation
  const navigate = useNavigate();

  const [system, setSystem] = useState({ temperature: 20, humidity: 50 });
  const [isNewPlantFormOpen, setIsNewPlantFormOpen] = useState(false);
  const [isNewSystemFormOpen, setIsNewSystemFormOpen] = useState(false);
  const [isNewGenusFormOpen, setIsNewGenusFormOpen] = useState(false);
  const [showSystem, setShowSystem] = useState(false);

  useEffect(() => {
    const system = {temperature: 20, humidity: 80};
    // Fetch plant data from the server
    fetch('http://localhost:5000/system')
      .then((response) => response.json())
      .then(() => setSystem(system))
      .catch(() => setSystem(system));
  }, []);

  const openSystem = () => {
    setShowSystem(true);
  };

  return (
    <>
      <div className="App">
        {!showSystem && ( // yuck
          <div>
            <div className='system_min' onClick={() => openSystem()}>
              <System
                system = {system}
              />
            </div>
            <IconButton size="large" className={`home_icon`} color="primary" onClick ={()=>{ navigate("/plants")}}>
              <GrassOutlinedIcon className='home_icon'/>
            </IconButton>
          </div>
        )}
        {!showSystem && ( // yuck
          <ButtonGroup size="lg">
            <IconButton size="large" color="secondary" onClick={() => setIsNewPlantFormOpen(true)}>
              <AddSharpIcon className={`home_button `} />
            </IconButton>
            <IconButton size="large" color="secondary" onClick={() => setIsNewSystemFormOpen(true)}>
              <PointOfSaleIcon className={`home_button `} />
            </IconButton>
            <IconButton size="large" color="secondary" onClick={() => setIsNewGenusFormOpen(true)}>
              <FingerprintSharpIcon className={`home_button `} />
            </IconButton>
            <IconButton size="large" color="error" onClick={() => openSystem(true)}>
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
        <NewSystemForm
          isOpen={isNewSystemFormOpen}
          onRequestClose={() => setIsNewSystemFormOpen(false)}
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
