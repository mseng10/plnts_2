import { Paper, Typography, Box, Grid, LinearProgress } from '@mui/material';

const BudgetSummary = ({ budget, totalSpent }) => {
  const remaining = budget - totalSpent;
  const progress = budget > 0 ? (totalSpent / budget) * 100 : 0;
  
  const getProgressColor = () => {
    if (progress > 90) return 'error';
    if (progress > 70) return 'warning';
    return 'primary';
  };

  return (
    <Paper sx={{ p: 2, mb: 2, backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <Typography variant="h6">Total Budget</Typography>
          <Typography variant="h4" color="primary">${budget.toFixed(2)}</Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h6">Spent</Typography>
          <Typography variant="h4" color={remaining < 0 ? 'error.main' : 'inherit'}>${totalSpent.toFixed(2)}</Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h6">Remaining</Typography>
          <Typography variant="h4" color={remaining < 0 ? 'error.main' : 'secondary.main'}>${remaining.toFixed(2)}</Typography>
        </Grid>
      </Grid>
      <Box sx={{ mt: 2 }}>
        <LinearProgress 
          variant="determinate" 
          value={Math.min(progress, 100)} 
          color={getProgressColor()} 
          sx={{height: 8, borderRadius: 4}}/>
      </Box>
    </Paper>
  );
};

export default BudgetSummary;