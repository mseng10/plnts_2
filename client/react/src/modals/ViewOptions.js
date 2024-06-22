import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import {useNavigate} from "react-router-dom" 

const ViewOptions = ({ isOpen, onClose }) => {
  // Navigation
  const navigate = useNavigate();
  
  return (
    <div>
      <Modal
        open={isOpen}
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
            <IconButton color="primary" onClick ={()=>{ navigate("/plants")}}>
              <GrassOutlinedIcon className={`modal_button `} />
            </IconButton>
            <IconButton color="secondary" onClick ={()=>{ navigate("/systems")}}>
              <PointOfSaleIcon className={`modal_button `} />
            </IconButton>
            <IconButton color="error" onClick={() => onClose()}>
              <CloseSharpIcon className={`modal_button `} />
            </IconButton>
          </ButtonGroup>
        </Box>
      </Modal>
    </div>
  );
};

export default ViewOptions;
