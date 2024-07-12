// Home.js
import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';
import System from './System'
import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import {useNavigate} from "react-router-dom" 

const Home = () => {
  // Navigation
  const navigate = useNavigate();

  // Passable Data
  const [systems, setSystems] = useState([]);

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
      </div>
    </>
  );
};

export default Home;
