import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconFactory from './IconFactory';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export const FormButton = ({icon, color, handleCancel}) => {
  // Handle case when system data is not available
  return  (
    <Stack direction="column" alignItems="center" spacing={2}>
      <IconFactory
        icon={icon}
        color={color}
        size={"xxxlg"}
      />
      <ButtonGroup>
        <IconButton className="left_button" type="submit" color="info">
          <IconFactory
            icon={"check"}
            size={"xlg"}
          />
        </IconButton>
        <IconButton className="left_button" color="error" onClick={handleCancel}>
          <IconFactory
            icon={"close"}
            size={"xlg"}
          />
        </IconButton>
      </ButtonGroup>
    </Stack>)
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
    if (!fieldInfo || !fieldInfo.options) {
        return null; // Return null for cleaner rendering if props are missing
    }

    return (
        <Autocomplete
            // The component is no longer freeSolo to prevent users from entering invalid data.
            // If you need freeSolo, the onChange logic would need to be more complex.
            disableClearable
            // Pass the full object to the value prop for proper state management.
            value={fieldInfo.value}
            // The options are the full objects.
            options={fieldInfo.options}
            // Tell Autocomplete how to get the display label from an option object.
            getOptionLabel={(option) => option.name || ''}
            // Tell Autocomplete how to compare options to the current value.
            isOptionEqualToValue={(option, value) => option.id === value.id}
            // The second argument, newValue, is the selected OBJECT from the options list.
            onChange={(event, newValue) => {
                fieldInfo.setValue(newValue); // Directly set the selected object to the state.
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    color={fieldInfo.color || 'primary'}
                    variant="standard"
                    label={fieldInfo.label}
                />
            )}
        />
    );
};

/** Returns a  */
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
