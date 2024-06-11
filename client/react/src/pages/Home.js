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
import Box from '@mui/material/Box';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import ReportGmailerrorredSharpIcon from '@mui/icons-material/ReportGmailerrorredSharp';
import NewLightForm from '../forms/NewLightForm';
import NewTypeForm from '../forms/NewTypeForm';
import TungstenSharpIcon from '@mui/icons-material/TungstenSharp';
import Modal from '@mui/material/Modal';
import CallSplitSharpIcon from '@mui/icons-material/CallSplitSharp';

const Home = () => {
  // Navigation
  const navigate = useNavigate();

  const [systems, setSystems] = useState({ temperature: 20, humidity: 50 });

  // Button Display
  const [isCreateButtonsOpen, setIsCreateButtonsOpen] = useState(false);
  const [isViewButtonsOpen, setIsViewButtonsOpen] = useState(false);

  // Forms
  const [isNewPlantFormOpen, setIsNewPlantFormOpen] = useState(false);
  const [isNewSystemFormOpen, setIsNewSystemFormOpen] = useState(false);
  const [isNewGenusFormOpen, setIsNewGenusFormOpen] = useState(false);
  const [isNewLightFormOpen, setIsNewLightFormOpen] = useState(false);
  const [isNewTypeFormOpen, setIsNewTypeFormOpen] = useState(false);

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
        <Box>
          <ButtonGroup size="lg">
            <IconButton size="large" color="secondary" onClick={() => setIsCreateButtonsOpen(true)}>
              <AddSharpIcon className={`home_button `} />
            </IconButton>
            <IconButton size="large" color="info" onClick={() => setIsViewButtonsOpen(true)}>
              <VisibilitySharpIcon className={`home_button `} />
            </IconButton>
            <IconButton size="large" color="error" onClick={() => console.log("WIP")}>
              <ReportGmailerrorredSharpIcon className={`home_button `} />
            </IconButton>
          </ButtonGroup>
        </Box>
        {isCreateButtonsOpen && (
          <Modal
            open={isCreateButtonsOpen}
            aria-labelledby="new-bobby-form"
            disableAutoFocus={true}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'inherit',
              border: 'none',
            }}
          >
            <Box sx={{ borderRadius: 2 }}>
              <ButtonGroup size="lg" fullWidth style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'inherit',
                border: 'none',
              }}>
                <IconButton size="small" color="primary" onClick={() => setIsNewPlantFormOpen(true)}>
                  <GrassOutlinedIcon className={`left_button `} />
                </IconButton>
                <IconButton size="small" color="type" onClick={() => setIsNewTypeFormOpen(true)}>
                  <CallSplitSharpIcon className={`left_button `} />
                </IconButton>
                <IconButton size="small" color="genus" onClick={() => setIsNewGenusFormOpen(true)}>
                  <FingerprintSharpIcon className={`left_button `} />
                </IconButton>
              </ButtonGroup>
              <ButtonGroup size="lg" fullWidth lassName='centered' style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'inherit',
                border: 'none',
              }}>
                <IconButton size="small" color="info" onClick={() => setIsNewSystemFormOpen(true)}>
                  <PointOfSaleIcon className={`left_button `} />
                </IconButton>
                <IconButton size="small" sx={{ color: '#ffeb3b'}} onClick={() => setIsNewLightFormOpen(true)}>
                  <TungstenSharpIcon className="left_button"/>
                </IconButton>
              </ButtonGroup>
              <ButtonGroup size="lg" fullWidth lassName='centered' style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'inherit',
                border: 'none',
              }}>
                <IconButton size="small" color="error" onClick={() => setIsCreateButtonsOpen(false)}>
                  <CloseSharpIcon className="left_button"/>
                </IconButton>
              </ButtonGroup>
            </Box>
          </Modal>
        )}
        {isViewButtonsOpen && (
          <Modal
            open={isViewButtonsOpen}
            aria-labelledby="new-bobby-form"
            disableAutoFocus={true}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'inherit',
              border: 'none',
            }}
          >
            <Box sx={{ borderRadius: 2 }}>
              <ButtonGroup size="lg">
                <IconButton size="small" color="primary" onClick ={()=>{ navigate("/plants")}}>
                  <GrassOutlinedIcon className={`left_button `} />
                </IconButton>
                <IconButton size="small" color="secondary" onClick ={()=>{ navigate("/systems")}}>
                  <PointOfSaleIcon className={`left_button `} />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => setIsViewButtonsOpen(false)}>
                  <CloseSharpIcon className="left_button"/>
                </IconButton>
              </ButtonGroup>
            </Box>
          </Modal>
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
        <NewLightForm
          isOpen={isNewLightFormOpen}
          onRequestClose={() => setIsNewLightFormOpen(false)}
        />
        <NewTypeForm
          isOpen={isNewTypeFormOpen}
          onRequestClose={() => setIsNewTypeFormOpen(false)}
        />
      </div>
    </>
  );
};

export default Home;
