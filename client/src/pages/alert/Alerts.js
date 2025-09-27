// import React from 'react';
// import Grid from '@mui/material/Grid';
// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import { CardActionArea, CardHeader } from '@mui/material';
// import Avatar from '@mui/material/Avatar';
// import IconButton from '@mui/material/IconButton';
// import CardActions from '@mui/material/CardActions';
// import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
// import Typography from '@mui/material/Typography';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import { useAlerts } from '../../hooks/useAlerts';
// import { CARD_STYLE, AVATAR_STYLE } from '../../constants';
// import { ServerError, Loading, NoDataHappy } from '../../elements/Page';
// // import { EditSharp } from '@mui/icons-material';

// const AlertCard = ({ alert, onResolve }) => {

//   return (
//     <Grid item width={300}>
//       <Card sx={CARD_STYLE} borderRadius={20}>
//         <CardActionArea>
//           <CardHeader
//             avatar={
//               <Avatar sx={AVATAR_STYLE}>
//                 <FormatListNumberedIcon className="small_button" color='info'/>
//               </Avatar>
//             }
//             title={alert.type}
//             // subheader={
//             //   <span style={{ color: isPastDue ? 'error.main' : 'text.secondary' }}>
//             //     {dayjs(todo.due_on).format('MMM D, YYYY')}
//             //   </span>
//             // }
//             subheaderTypographyProps={{
//               sx: { color: 'error.main' }
//             }}
//           />
//           <CardContent>
//             <Box>
//               <Typography variant="body2" color="text.secondary">
//                 {alert.description}
//               </Typography>
//             </Box>
//           </CardContent>
//           <CardActions disableSpacing>
//             {/* <IconButton color="info" onClick={() => navigate(`/todo/${todo.id}`)}>
//               <EditSharp />
//             </IconButton> */}
//             <IconButton color="info" onClick={() => onResolve(alert.id)}>
//               <CheckCircleOutlineIcon />
//             </IconButton>
//           </CardActions>
//         </CardActionArea>
//       </Card>
//     </Grid>
//   )
// };

// const Alerts = () => {
//   const { alerts, isLoading, error, resolveAlert } = useAlerts();

//   if (isLoading) return <Loading/>;
//   if (error) return <ServerError/>;
//   if (alerts.length === 0) return <NoDataHappy/>;

//   return (
//     <div className="App">
//       <Grid container justifyContent="center" spacing={4}>
//         {alerts.map((alert) => (
//           <AlertCard key={alert.id} alert={alert} onResolve={resolveAlert} />
//         ))}
//       </Grid>
//     </div>
//   );
// };

// export default Alerts;