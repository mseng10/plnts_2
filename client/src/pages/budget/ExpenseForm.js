import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, Stack, TextField, MenuItem, Button, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { EXPENSE_CATEGORIES } from '../../hooks/useBudget';

const ExpenseForm = ({ expense, onSave, onClose }) => {
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES.NEED);

  useEffect(() => {
    if (expense) {
      setName(expense.name);
      setCost(expense.cost);
      setCategory(expense.category);
    } else {
      // Reset for new expense
      setName('');
      setCost('');
      setCategory(EXPENSE_CATEGORIES.NEED);
    }
  }, [expense]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const expenseData = {
      name,
      cost: parseFloat(cost),
      category,
    };
    if (expense) {
      expenseData.id = expense.id;
    }
    onSave(expenseData);
  };

  return (
    <Card sx={{ 
      width: '100%', 
      borderRadius: 4, 
      bgcolor: 'rgba(0,0,0,0.2)', 
      backdropFilter: 'blur(10px)',
      maxHeight: 'calc(100vh - 32px)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <CardHeader
        title={expense ? 'Edit Expense' : 'Add Expense'}
        action={
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        }
        titleTypographyProps={{ variant: 'h5', color: 'primary' }}
        sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)', flexShrink: 0 }}
      />
      <CardContent sx={{ overflowY: 'auto', flexGrow: 1, p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Expense Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              label="Cost"
              variant="outlined"
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
              inputProps={{ step: '0.01' }}
            />
            <TextField
              label="Category"
              variant="outlined"
              select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value={EXPENSE_CATEGORIES.NEED}>Needed</MenuItem>
              <MenuItem value={EXPENSE_CATEGORIES.CRAP}>Crap</MenuItem>
            </TextField>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
              <Button onClick={onClose} color="secondary">Cancel</Button>
              <Button type="submit" variant="contained" color="primary">Save</Button>
            </Box>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;