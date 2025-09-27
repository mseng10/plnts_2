// import { Paper, Typography, Box, Grid, LinearProgress } from '@mui/material';

// const BudgetSummary = ({ budget, totalSpent }) => {
//   const remaining = budget - totalSpent;
//   const progress = budget > 0 ? (totalSpent / budget) * 100 : 0;
  
//   const getProgressColor = () => {
//     if (progress > 90) return 'error';
//     if (progress > 70) return 'warning';
//     return 'primary';
//   };

//   // Calculate daily amount from today to closest 5th of upcoming month
//   const calculateDailyAmount = () => {
//     const today = new Date();
//     const currentMonth = today.getMonth();
//     const currentYear = today.getFullYear();
    
//     // Find the next 5th
//     let targetDate;
//     const fifthOfCurrentMonth = new Date(currentYear, currentMonth, 5);
    
//     if (today <= fifthOfCurrentMonth) {
//       // If today is on or before the 5th of current month, target is 5th of current month
//       targetDate = fifthOfCurrentMonth;
//     } else {
//       // If today is after the 5th, target is 5th of next month
//       targetDate = new Date(currentYear, currentMonth + 1, 5);
//     }
    
//     // Calculate days from today (inclusive) to target date
//     const timeDiff = targetDate.getTime() - today.getTime();
//     const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include today
    
//     // Calculate daily amount (show 0 if remaining is negative)
//     const dailyAmount = remaining < 0 ? 0 : remaining / daysDiff;
    
//     return { dailyAmount, daysLeft: daysDiff, targetDate };
//   };

//   const { dailyAmount, daysLeft, targetDate } = calculateDailyAmount();

//   return (
//     <Paper sx={{ p: 2, mb: 2, backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
//       <Grid container spacing={2} alignItems="center">
//         <Grid item xs={12} md={3}>
//           <Typography variant="h6">Total Budget</Typography>
//           <Typography variant="h4" color="primary">${budget.toFixed(2)}</Typography>
//         </Grid>
//         <Grid item xs={12} md={3}>
//           <Typography variant="h6">Spent</Typography>
//           <Typography variant="h4" color={remaining < 0 ? 'error.main' : 'inherit'}>${totalSpent.toFixed(2)}</Typography>
//         </Grid>
//         <Grid item xs={12} md={3}>
//           <Typography variant="h6">Remaining</Typography>
//           <Typography variant="h4" color={remaining < 0 ? 'error.main' : 'secondary.main'}>${remaining.toFixed(2)}</Typography>
//         </Grid>
//         <Grid item xs={12} md={3}>
//           <Typography variant="h6">Daily Budget</Typography>
//           <Typography variant="h4" color="success.main">${dailyAmount.toFixed(2)}</Typography>
//           <Typography variant="caption" color="text.secondary">
//             {daysLeft} days until {targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//           </Typography>
//         </Grid>
//       </Grid>
//       <Box sx={{ mt: 2 }}>
//         <LinearProgress 
//           variant="determinate" 
//           value={Math.min(progress, 100)} 
//           color={getProgressColor()} 
//           sx={{height: 8, borderRadius: 4}}/>
//       </Box>
//     </Paper>
//   );
// };

// export default BudgetSummary;