// Home.js
import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';
import System from './System'
import ButtonGroup from '@mui/material/ButtonGroup';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import NewPlantForm from '../forms/NewPlantForm';
import NewGenusForm from '../forms/NewGenusForm';
import NewSystemForm from '../forms/NewSystemForm';
import FingerprintSharpIcon from '@mui/icons-material/FingerprintSharp';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import {useNavigate} from "react-router-dom" 



const Home = () => {
  // Navigation
  const navigate = useNavigate();

  const [systems, setSystems] = useState({ temperature: 20, humidity: 50 });
  const [isNewPlantFormOpen, setIsNewPlantFormOpen] = useState(false);
  const [isNewSystemFormOpen, setIsNewSystemFormOpen] = useState(false);
  const [isNewGenusFormOpen, setIsNewGenusFormOpen] = useState(false);

  useEffect(() => {
    // Fetch plant data from the server
    fetch('http://localhost:5000/systems')
      .then((response) => response.json())
      .then((data) => setSystems(data))
      .catch(() => console.log("Oh no"));
  }, []);

  return (
    <>
      <div className="App">
        <div>
          <div className='system_min'>
            <System
              system = {systems[0]}
            />
          </div>
          <IconButton size="large" className={`home_icon`} color="primary" onClick ={()=>{ navigate("/plants")}}>
            <GrassOutlinedIcon className='home_icon'/>
          </IconButton>
        </div>
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
        </ButtonGroup>
        
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
