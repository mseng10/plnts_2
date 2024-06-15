import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import FingerprintSharpIcon from '@mui/icons-material/FingerprintSharp';
import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';
import NewPlantForm from '../forms/create/NewPlantForm';
import NewGenusForm from '../forms/create/NewGenusForm';
import NewSystemForm from '../forms/create/NewSystemForm';
import NewLightForm from '../forms/create/NewLightForm';
import NewTypeForm from '../forms/create/NewTypeForm';
import TungstenSharpIcon from '@mui/icons-material/TungstenSharp';
import MergeTypeSharpIcon from '@mui/icons-material/MergeTypeSharp';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';

const CreateOptions = ({ isOpen, onClose }) => {
  const CreateForm = Object.freeze({
    PLANT: 0,
    SYSTEM: 1,
    GENUS: 2,
    LIGHT: 3,
    TYPE: 4
  });

  const [currentForm, setCurrentForm] = useState(null);

  const onCreateClose = () => {
    setCurrentForm(null);
    onClose();
  };

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
            <IconButton size="small" color="primary" onClick={() => setCurrentForm(CreateForm.PLANT)}>
              <GrassOutlinedIcon className={`modal_button `} />
            </IconButton>
            <IconButton size="small" color="type" onClick={() => setCurrentForm(CreateForm.TYPE)}>
              <MergeTypeSharpIcon className={`modal_button `} />
            </IconButton>
            <IconButton size="small" color="genus" onClick={() => setCurrentForm(CreateForm.GENUS)}>
              <FingerprintSharpIcon className={`modal_button `} />
            </IconButton>
          </ButtonGroup>
          <ButtonGroup size="lg" fullWidth lassName='centered' style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'inherit',
            border: 'none',
          }}>
            <IconButton size="small" color="secondary" onClick={() => setCurrentForm(CreateForm.SYSTEM)}>
              <PointOfSaleIcon className={`modal_button `} />
            </IconButton>
            <IconButton size="small" sx={{ color: '#ffeb3b'}} onClick={() => setCurrentForm(CreateForm.LIGHT)}>
              <TungstenSharpIcon className="modal_button"/>
            </IconButton>
          </ButtonGroup>
          <ButtonGroup size="lg" fullWidth lassName='centered' style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'inherit',
            border: 'none',
          }}>
            <IconButton size="small" color="error" onClick={() => onCreateClose()}>
              <CloseSharpIcon className="left_button"/>
            </IconButton>
          </ButtonGroup>
        </Box>
      </Modal>
      <NewPlantForm
        isOpen={currentForm === CreateForm.PLANT}
        onRequestClose={onCreateClose}
      />
      <NewSystemForm
        isOpen={currentForm === CreateForm.SYSTEM}
        onRequestClose={onCreateClose}
      />
      <NewGenusForm
        isOpen={currentForm === CreateForm.GENUS}
        onRequestClose={onCreateClose}
        allGenus={[]}
      />
      <NewLightForm
        isOpen={currentForm === CreateForm.LIGHT}
        onRequestClose={onCreateClose}
      />
      <NewTypeForm
        isOpen={currentForm === CreateForm.TYPE}
        onRequestClose={onCreateClose}
      />
    </div>
  );
};

export default CreateOptions;
