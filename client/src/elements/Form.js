import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconFactory from './IconFactory';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


export const FormButton = ({icon, color, handleCancel}) => {
  // Handle case when system data is not available
  return  (
    <div className='left'>
      <IconFactory
        icon={icon}
        color={color}
        size={"xxxlg"}
      ></IconFactory>
      <ButtonGroup>
        <IconButton className="left_button" type="submit" color="info">
          <IconFactory
            icon={"check"}
            size={"xlg"}
          >
          </IconFactory>
        </IconButton>
        <IconButton className="left_button" color="error" onClick={handleCancel}>
          <IconFactory
            icon={"close"}
            size={"xlg"}
          >
          </IconFactory>
        </IconButton>
      </ButtonGroup>
    </div>)
};

export const TextAreaInput = (fieldInfo) => {
  if (!fieldInfo) {
    return <div></div>
  }
  
  return  (
    <div>
      <TextField
        multiline
        rows={6}
        margin="normal"
        fullWidth
        required
        label={fieldInfo.label}
        value={fieldInfo.value}
        variant="standard"
        color={fieldInfo.color}
        onChange={(event) => fieldInfo.setValue(event.target.value)}
      />
    </div>)
};

export const AutoCompleteInput = (fieldInfo) => {
  const test = (value, newInputValue) => {
    
    console.log(value);
    console.log(newInputValue);
  };

  if (!fieldInfo) {
    return <div></div>
  }

  return  (
    <div>
      <Autocomplete
        freeSolo
        color={fieldInfo.color}
        disableClearable
        value={fieldInfo.value ? fieldInfo.value.name : ''}
        options={fieldInfo.options.map((option) => option.name)}
        onInputChange={test}
        onChange={(event) => fieldInfo.setValue(fieldInfo.options[event.target.value])}
        renderInput={(params) => (
          <TextField
            color={fieldInfo.color}
            variant="standard"
            {...params}
            label={fieldInfo.label}
            InputProps={{
              ...params.InputProps,
              type: 'search',
            }}
          />
        )}
      />
    </div>)
};

export const FormTextInput = (fieldInfo) => {
  if (!fieldInfo) {
    return <div></div>
  }
  
  return  (
    <div>
      <TextField
        margin="normal"
        fullWidth
        required
        label={fieldInfo.label}
        value={fieldInfo.value}
        variant="standard"
        color={fieldInfo.color}
        onChange={(event) => fieldInfo.setValue(event.target.value)}
      />
    </div>)
};

export const NumberInput = (fieldInfo) => {
  if (!fieldInfo) {
    return <div></div>
  }

  return  (
    <div>
      <TextField
        type="number"
        margin="normal"
        fullWidth
        required
        label={fieldInfo.label}
        value={fieldInfo.value}
        variant="standard"
        color={fieldInfo.color}
        onChange={(event) => fieldInfo.setValue(event.target.value)}
      />
    </div>)
};

export const SliderInput = (fieldInfo) => {
  if (!fieldInfo) {
    return <div></div>
  }

  return  (
    <div>
      <Stack spacing={2} direction="row" alignItems="center" color={fieldInfo.color} height={64}>
        <IconFactory
          icon={fieldInfo.icon}
          color={"primary"}
          size={"md"}
        ></IconFactory>
        <Slider
          color="info"
          required
          aria-label={fieldInfo.label}
          value={fieldInfo.value}
          onChange={(event) => fieldInfo.setValue(event.target.value)}
          variant="standard"
          step={fieldInfo.step}
          marks={fieldInfo.marks}
          min={fieldInfo.min}
          max={fieldInfo.max}
          valueLabelDisplay="auto"
        />
      </Stack>
    </div>)
};

export const DropdownInput = (fieldInfo) => {
  if (!fieldInfo) {
    return <div></div>
  }

  return  (
    <div>
      <TextField
        margin="normal"
        // sx={{
        //   width: "75%"
        // }}
        required
        select
        fullWidth
        label={fieldInfo.label}
        variant="standard"
        value={fieldInfo.value}
        onChange={(event) => fieldInfo.setValue(event.target.value)}
        color={fieldInfo.color}
      >
        {Array.from(fieldInfo.options).map((ty) => (
          <MenuItem key={ty} value={ty}>{ty}</MenuItem>
        ))}
      </TextField>
    </div>)
};

export const DateSelector = (fieldInfo) => {
  if (!fieldInfo) {
    return <div></div>
  }

  return  (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          variant="standard"
          margin="normal"
          fullWidth
          label={fieldInfo.label}
          value={fieldInfo.value}
          onChange={(event) => fieldInfo.setValue(event)}
          renderInput={(params) => <TextField {...params} />}
          color={fieldInfo.color}
        />
      </LocalizationProvider>
    </div>)
};
