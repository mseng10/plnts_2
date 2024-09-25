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



export const FieldRenderer = ({field, value, onChange}) => {
  if (React.isValidElement(field.component)) {
    // If it's a React element, clone it and pass props
    return React.cloneElement(field.component, { value, onChange: (newValue) => onChange(field.name, newValue) });
  } else if (typeof field.component === 'function') {
    // If it's a function component, render it with props
    const CustomComponent = field.component;
    
    return <CustomComponent value={value} onChange={(newValue) => onChange(field.name, newValue)} />;
  }

  switch (field.type) {
    case 'text':
      return (
        <TextAreaInput
          label={field.label}
          value={value}
          name={field.name}
          color="primary"
          setValue={onChange}
        />)
    case 'input':
      return (
        <FormTextInput
          label={field.label}
          name={field.name}
          value={value}
          color="primary"
          setValue={onChange}
        />)
    case 'date':
      return (
        <DateSelector
          label={field.label}
          value={value}
          setValue={onChange}
          name={field.name}
        />
      )
    case 'number':
      return (
        <NumberInput
          label={field.label}
          value={value}
          setValue={onChange}
          name={field.name}
        />
      )
    default:
      return <div></div>
      }
}

export const DynamicForm = ({ sections, onSubmit, onCancel, initialModel={} }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
    const importedData = sections.flatMap(section => section.fields).reduce((acc, field) => {
      const value = initialModel[field.name];
      acc[field.name] = field.import ? field.import(value) : value;

      return acc;
    }, {});
    setFormData(importedData);
  }, [initialModel, sections]);

  const handleSubmit = (_e) => {
    _e.preventDefault();
    const exportedData = Object.entries(formData).reduce((acc, [key, value]) => {
      const field = sections.flatMap(_s => _s.fields).find(_f => _f.name === key);
      if (field && field.export) {
        acc[key] = field.export(value);
      } else {
        acc[key] = value;
      }

      return acc;
    }, {});
    onSubmit(exportedData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {sections.map((section) => (
          <Box sx={section.size} key="1">
          {section.icon && (
            <div className='left'>
            <IconFactory
              icon={section.icon}
              color={"primary"}
              size={"xxxlg"}
            ></IconFactory>
            </div>
          )}
          <div className='right'>

          {section.fields.map((field) => (
            <div key={field.name}>
              <FieldRenderer
                field={field}
                value={formData[field.name] || field.default}
                onChange={handleChange}
              />
            </div>
          ))}            
          </div>
        </Box>
      ))}
        <IconButton className="left_button" type="submit" color="info">
          <IconFactory
            icon={"check"}
            size={"xlg"}
          >
          </IconFactory>
        </IconButton>    
        <IconButton className="right_button" color="error" onClick={onCancel}>
          <IconFactory
            icon={"close"}
            size={"xlg"}
          >
          </IconFactory>
        </IconButton>    
        </form>
  );
};
