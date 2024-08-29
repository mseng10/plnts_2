import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';
import React from 'react';
import IconButton from '@mui/material/IconButton';
import {useNavigate} from "react-router-dom" 

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="App">
        <div>
          <div className='system_min'>
          </div>
          <IconButton color="primary" onClick ={()=>{ navigate("/plants")}}>
            <GrassOutlinedIcon className='home_icon'/>
          </IconButton>
        </div>
      </div>
    </>
  );
};

export default Home;
