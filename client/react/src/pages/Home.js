// Home.js
import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';
import React from 'react';
import IconButton from '@mui/material/IconButton';
import {useNavigate} from "react-router-dom" 

const Home = () => {
  // Navigation
  const navigate = useNavigate();

  return (
    <>
      <div className="App">
        <div>
          <div className='system_min'>
          </div>
          <IconButton color="primary" onClick ={()=>{ navigate("/plant/view")}}>
            <GrassOutlinedIcon className='home_icon'/>
          </IconButton>
        </div>
      </div>
    </>
  );
};

export default Home;
