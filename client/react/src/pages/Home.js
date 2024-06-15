// Home.js
import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';
import System from './System'
import ButtonGroup from '@mui/material/ButtonGroup';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import {useNavigate} from "react-router-dom" 
import Box from '@mui/material/Box';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import ReportGmailerrorredSharpIcon from '@mui/icons-material/ReportGmailerrorredSharp';
import Modal from '@mui/material/Modal';
import CreateOptions from '../modals/CreateOptions';

const Home = () => {
  // Navigation
  const navigate = useNavigate();

  // Passable Data
  const [systems, setSystems] = useState([]);

  // Button Display
  const [isCreateButtonsOpen, setIsCreateButtonsOpen] = useState(false);
  const [isViewButtonsOpen, setIsViewButtonsOpen] = useState(false);

  useEffect(() => {
    // Fetch system data from the server
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
          <CreateOptions
            isOpen={isCreateButtonsOpen}
            onClose={() => setIsCreateButtonsOpen(false)}
          />
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
      </div>
    </>
  );
};

export default Home;
