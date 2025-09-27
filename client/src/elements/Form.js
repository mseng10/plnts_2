// import React, { useState, useEffect } from 'react';
// import TextField from '@mui/material/TextField';
// import Autocomplete from '@mui/material/Autocomplete';
// import IconButton from '@mui/material/IconButton';
// import ButtonGroup from '@mui/material/ButtonGroup';
// import IconFactory from './IconFactory';
// import Slider from '@mui/material/Slider';
// import Stack from '@mui/material/Stack';
// import MenuItem from '@mui/material/MenuItem';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// // Shared glassmorphism styling function
// const getFormFieldStyles = () => ({
//   '& .MuiOutlinedInput-root': {
//     backgroundColor: 'rgba(255, 255, 255, 0.05)',
//     backdropFilter: 'blur(10px)',
//     '& fieldset': {
//       borderColor: 'rgba(255, 255, 255, 0.3)',
//     },
//     '&:hover fieldset': {
//       borderColor: 'rgba(255, 255, 255, 0.5)',
//     },
//     '&.Mui-focused fieldset': {
//       borderColor: 'primary.main',
//     },
//   },
//   '& .MuiInputLabel-root': {
//     color: 'rgba(255, 255, 255, 0.7)',
//     '&.Mui-focused': {
//       color: 'primary.main',
//     },
//   },
//   '& .MuiInputBase-input': {
//     color: 'white',
//   },
//   '& .MuiSelect-icon': {
//     color: 'rgba(255, 255, 255, 0.7)',
//   },
// });

// export const FormButton = ({icon, color, handleCancel}) => {
//   return (
//     <Stack direction="column" alignItems="center" spacing={2}>
//       <IconFactory
//         icon={icon}
//         color={color}
//         size={"xxxlg"}
//       />
//       <ButtonGroup
//         sx={{
//           '& .MuiButton-root': {
//             backgroundColor: 'rgba(255, 255, 255, 0.1)',
//             backdropFilter: 'blur(10px)',
//             border: '1px solid rgba(255, 255, 255, 0.2)',
//             '&:hover': {
//               backgroundColor: 'rgba(255, 255, 255, 0.2)',
//             },
//           },
//         }}
//       >
//         <IconButton className="left_button" type="submit" color="info">
//           <IconFactory
//             icon={"check"}
//             size={"xlg"}
//           />
//         </IconButton>
//         <IconButton className="left_button" color="error" onClick={handleCancel}>
//           <IconFactory
//             icon={"close"}
//             size={"xlg"}
//           />
//         </IconButton>
//       </ButtonGroup>
//     </Stack>
//   );
// };

// export const TextAreaInput = (fieldInfo) => {
//   if (!fieldInfo) {
//     return <div></div>;
//   }
  
//   return (
//     <div>
//       <TextField
//         multiline
//         rows={6}
//         margin="normal"
//         fullWidth
//         required
//         label={fieldInfo.label}
//         value={fieldInfo.value}
//         variant="outlined"
//         color={fieldInfo.color}
//         onChange={(event) => fieldInfo.setValue(event.target.value)}
//         sx={getFormFieldStyles()}
//       />
//     </div>
//   );
// };

// export const AutoCompleteInput = (fieldInfo) => {
//   if (!fieldInfo || !fieldInfo.options) {
//     return null;
//   }

//   return (
//     <Autocomplete
//       disableClearable
//       value={fieldInfo.value}
//       options={fieldInfo.options}
//       getOptionLabel={(option) => option.name || ''}
//       isOptionEqualToValue={(option, value) => option.id === value.id}
//       onChange={(event, newValue) => {
//         fieldInfo.setValue(newValue);
//       }}
//       filterOptions={(options, { inputValue }) => {
//         // Custom filter to handle large datasets
//         if (!inputValue) return options.slice(0, 300); // Show first 300 when no input
//         return options.filter(option =>
//           option.name?.toLowerCase().includes(inputValue.toLowerCase())
//         ).slice(0, 300); // Limit filtered results to 300
//       }}
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           color={fieldInfo.color || 'primary'}
//           variant="outlined"
//           label={fieldInfo.label}
//           margin="normal"
//           sx={getFormFieldStyles()}
//         />
//       )}
//       sx={{
//         '& .MuiAutocomplete-popupIndicator': {
//           color: 'rgba(255, 255, 255, 0.7)',
//         },
//         '& .MuiAutocomplete-clearIndicator': {
//           color: 'rgba(255, 255, 255, 0.7)',
//         },
//         '& .MuiAutocomplete-paper': {
//           backgroundColor: 'rgba(0, 0, 0, 0.8)',
//           backdropFilter: 'blur(10px)',
//           border: '1px solid rgba(255, 255, 255, 0.2)',
//           maxHeight: '400px',
//         },
//         '& .MuiAutocomplete-listbox': {
//           maxHeight: '400px',
//           overflow: 'auto',
//         },
//         '& .MuiAutocomplete-option': {
//           color: 'white',
//           '&:hover': {
//             backgroundColor: 'rgba(255, 255, 255, 0.1)',
//           },
//           '&.Mui-focused': {
//             backgroundColor: 'rgba(255, 255, 255, 0.2)',
//           },
//         },
//       }}
//     />
//   );
// };

// export const FormTextInput = (fieldInfo) => {
//   if (!fieldInfo) {
//     return <div></div>;
//   }
  
//   return (
//     <div>
//       <TextField
//         margin="normal"
//         fullWidth
//         required
//         label={fieldInfo.label}
//         value={fieldInfo.value}
//         variant="outlined"
//         color={fieldInfo.color}
//         onChange={(event) => fieldInfo.setValue(event.target.value)}
//         sx={getFormFieldStyles()}
//       />
//     </div>
//   );
// };

// export const NumberInput = (fieldInfo) => {
//   if (!fieldInfo) {
//     return <div></div>;
//   }

//   return (
//     <div>
//       <TextField
//         type="number"
//         margin="normal"
//         fullWidth
//         required
//         label={fieldInfo.label}
//         value={fieldInfo.value}
//         variant="outlined"
//         color={fieldInfo.color}
//         onChange={(event) => fieldInfo.setValue(event.target.value)}
//         sx={getFormFieldStyles()}
//       />
//     </div>
//   );
// };

// export const SliderInput = (fieldInfo) => {
//   if (!fieldInfo) {
//     return <div></div>;
//   }

//   return (
//     <div>
//       <Stack 
//         spacing={2} 
//         direction="row" 
//         alignItems="center" 
//         height={64}
//         sx={{
//           p: 2,
//           borderRadius: 2,
//           backgroundColor: 'rgba(255, 255, 255, 0.05)',
//           backdropFilter: 'blur(10px)',
//           border: '1px solid rgba(255, 255, 255, 0.2)',
//         }}
//       >
//         <IconFactory
//           icon={fieldInfo.icon}
//           color={"primary"}
//           size={"md"}
//         />
//         <Slider
//           color="primary"
//           required
//           aria-label={fieldInfo.label}
//           value={fieldInfo.value}
//           onChange={(event, newValue) => fieldInfo.setValue(newValue)}
//           step={fieldInfo.step}
//           marks={fieldInfo.marks}
//           min={fieldInfo.min}
//           max={fieldInfo.max}
//           valueLabelDisplay="auto"
//           sx={{
//             color: 'primary.main',
//             '& .MuiSlider-track': {
//               backgroundColor: 'primary.main',
//             },
//             '& .MuiSlider-rail': {
//               backgroundColor: 'rgba(255, 255, 255, 0.3)',
//             },
//             '& .MuiSlider-thumb': {
//               backgroundColor: 'primary.main',
//               '&:hover': {
//                 boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)',
//               },
//             },
//             '& .MuiSlider-valueLabel': {
//               backgroundColor: 'rgba(0, 0, 0, 0.8)',
//               backdropFilter: 'blur(10px)',
//               color: 'white',
//             },
//           }}
//         />
//       </Stack>
//     </div>
//   );
// };

// export const DropdownInput = (fieldInfo) => {
//   if (!fieldInfo) {
//     return <div></div>;
//   }

//   return (
//     <div>
//       <TextField
//         margin="normal"
//         required
//         select
//         fullWidth
//         label={fieldInfo.label}
//         variant="outlined"
//         value={fieldInfo.value}
//         onChange={(event) => fieldInfo.setValue(event.target.value)}
//         color={fieldInfo.color}
//         sx={{
//           ...getFormFieldStyles(),
//           '& .MuiSelect-select': {
//             color: 'white',
//           },
//         }}
//         SelectProps={{
//           MenuProps: {
//             PaperProps: {
//               sx: {
//                 backgroundColor: 'rgba(0, 0, 0, 0.8)',
//                 backdropFilter: 'blur(10px)',
//                 border: '1px solid rgba(255, 255, 255, 0.2)',
//                 '& .MuiMenuItem-root': {
//                   color: 'white',
//                   '&:hover': {
//                     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//                   },
//                   '&.Mui-selected': {
//                     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//                     '&:hover': {
//                       backgroundColor: 'rgba(255, 255, 255, 0.3)',
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         }}
//       >
//         {Array.from(fieldInfo.options).map((option) => (
//           <MenuItem key={option} value={option}>
//             {option}
//           </MenuItem>
//         ))}
//       </TextField>
//     </div>
//   );
// };

// export const DateSelector = (fieldInfo) => {
//   if (!fieldInfo) {
//     return <div></div>;
//   }

//   return (
//     <div>
//       <LocalizationProvider dateAdapter={AdapterDayjs}>
//         <DatePicker
//           label={fieldInfo.label}
//           value={fieldInfo.value}
//           onChange={(newValue) => fieldInfo.setValue(newValue)}
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               variant="outlined"
//               margin="normal"
//               fullWidth
//               color={fieldInfo.color}
//               sx={getFormFieldStyles()}
//             />
//           )}
//           sx={{
//             '& .MuiInputBase-root': {
//               color: 'white',
//             },
//             '& .MuiSvgIcon-root': {
//               color: 'rgba(255, 255, 255, 0.7)',
//             },
//           }}
//           PopperProps={{
//             sx: {
//               '& .MuiPaper-root': {
//                 backgroundColor: 'rgba(0, 0, 0, 0.9)',
//                 backdropFilter: 'blur(10px)',
//                 border: '1px solid rgba(255, 255, 255, 0.2)',
//                 color: 'white',
//               },
//               '& .MuiPickersDay-root': {
//                 color: 'white',
//                 '&:hover': {
//                   backgroundColor: 'rgba(255, 255, 255, 0.1)',
//                 },
//                 '&.Mui-selected': {
//                   backgroundColor: 'primary.main',
//                   '&:hover': {
//                     backgroundColor: 'primary.dark',
//                   },
//                 },
//               },
//               '& .MuiPickersCalendarHeader-root': {
//                 color: 'white',
//               },
//               '& .MuiIconButton-root': {
//                 color: 'white',
//               },
//             },
//           }}
//         />
//       </LocalizationProvider>
//     </div>
//   );
// };