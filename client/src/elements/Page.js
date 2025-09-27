// import React from 'react';
// import IconButton from '@mui/material/IconButton';
// import IconFactory from './IconFactory';
// import { Stack } from '@mui/material';
// import Alert from '@mui/material/Alert';

// const opacity = 0.7;

// /*** Full Page Button with alert. */
// export const PageButton = (icon, color, text, onClick) => {
//   return (
//     <Stack sx={{opacity: opacity}} direction="column" alignItems="center" height={52}>
//      <IconButton onClick={onClick}>
//         <IconFactory
//           icon={icon}
//           color={color}
//           size={"home_icon"}
//         />
//       </IconButton>
//       <Alert variant="outlined" severity={color}>
//         {text}
//       </Alert>
//     </Stack>
//     )
// };

// /** Server Error for full page view. */
// export const ServerError = () => {
//   return PageButton("serverError", "error", "Server Error.");
// };

// /** No data full page view. */
// export const NoData = () => {
//   return PageButton("noData", "primary", "No Data :0");
// };

// /** No data happy page view (good we don't have any:)). */
// export const NoDataHappy = () => {
//   return PageButton("happy", "primary", "No Data :)");
// }

// /** Loading data full page view. */
// export const Loading = () => {
//   return PageButton("loading", "primary", "");
// };