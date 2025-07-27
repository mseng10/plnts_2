import React, { useState, useMemo } from 'react';
import { Box, Grid, Typography, IconButton, Button, CircularProgress, TextField, Paper } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos, Add as AddIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useBudget, EXPENSE_CATEGORIES } from '../../hooks/useBudget';
import { Loading, ServerError } from '../../elements/Page';
import BudgetSummary from './BudgetSummary';
import ExpenseList from './ExpenseList';
import ExpenseForm from './ExpenseForm';

const BudgetPage = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const { budgets, expenses, isLoading, error, createBudget, updateBudget, createExpense, updateExpense, deleteExpense } = useBudget();
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  
  const [monthlyBudgetInput, setMonthlyBudgetInput] = useState('');

  const currentMonthStr = useMemo(() => currentDate.format('YYYY-MM'), [currentDate]);

  const { monthlyBudget, monthlyExpenses } = useMemo(() => {
    const budgetForMonth = budgets.find(b => b.month === currentMonthStr);
    const expensesForMonth = expenses.filter(e => dayjs(e.created_on).format('YYYY-MM') === currentMonthStr);
    return { monthlyBudget: budgetForMonth, monthlyExpenses: expensesForMonth };
  }, [budgets, expenses, currentMonthStr]);
  
  const { neededExpenses, crapExpenses, totalSpent } = useMemo(() => {
    const needed = monthlyExpenses.filter(e => e.category === EXPENSE_CATEGORIES.NEED);
    const crap = monthlyExpenses.filter(e => e.category === EXPENSE_CATEGORIES.CRAP);
    const total = monthlyExpenses.reduce((sum, e) => sum + (e.cost || 0), 0);
    return { neededExpenses: needed, crapExpenses: crap, totalSpent: total };
  }, [monthlyExpenses]);


  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'));
  };

  const handleOpenForm = (expense = null) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const handleCloseForm = () => {
    setShowExpenseForm(false);
    setEditingExpense(null);
  };

  const handleSaveExpense = async (expenseData) => {
    if (editingExpense) {
      await updateExpense(expenseData);
    } else {
      await createExpense(expenseData);
    }
    handleCloseForm();
  };

  const handleDeleteExpense = async (id) => {
    await deleteExpense(id);
  };
  
  const handleSetBudget = async () => {
    const budgetValue = parseFloat(monthlyBudgetInput);
    if (!isNaN(budgetValue) && budgetValue > 0) {
      if (monthlyBudget) {
        await updateBudget({ id: monthlyBudget.id, cost: budgetValue });
      } else {
        await createBudget({ cost: budgetValue, month: currentMonthStr });
      }
      setMonthlyBudgetInput('');
    }
  };

  if (isLoading && !budgets.length && !expenses.length) return <Loading />;
  if (error) return <ServerError message={error} />;

  return (
    <Box sx={{ display: 'flex', p: 2, height: '100%' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <IconButton onClick={handlePrevMonth}>
            <ArrowBackIosNew />
          </IconButton>
          <Typography variant="h4" component="h1">
            {currentDate.format('MMMM YYYY')}
          </Typography>
          <IconButton onClick={handleNextMonth}>
            <ArrowForwardIos />
          </IconButton>
        </Box>
        
        {/* Budget Summary or Setup */}
        {monthlyBudget ? (
          <BudgetSummary budget={monthlyBudget.budget} totalSpent={totalSpent} />
        ) : (
          <Paper sx={{ p: 2, mb: 2, display: 'flex', gap: 2, alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
            <TextField
              label="Set Monthly Budget"
              variant="outlined"
              type="number"
              value={monthlyBudgetInput}
              onChange={(e) => setMonthlyBudgetInput(e.target.value)}
              sx={{flexGrow: 1}}
              onKeyPress={(e) => e.key === 'Enter' && handleSetBudget()}
            />
            <Button variant="contained" onClick={handleSetBudget} disabled={isLoading}>Set Budget</Button>
          </Paper>
        )}

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
          sx={{ mb: 2, alignSelf: 'flex-start' }}
          disabled={!monthlyBudget}
        >
          Add Expense
        </Button>
        
        {/* Expenses Grid */}
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          <Grid item xs={12} md={6}>
            <ExpenseList title="Needed" expenses={neededExpenses} onEdit={handleOpenForm} onDelete={handleDeleteExpense} />
          </Grid>
          <Grid item xs={12} md={6}>
            <ExpenseList title="Crap" expenses={crapExpenses} onEdit={handleOpenForm} onDelete={handleDeleteExpense} />
          </Grid>
        </Grid>
      </Box>

      {/* Expense Form Side Panel */}
      <Box sx={{
        width: showExpenseForm ? 400 : 0,
        marginLeft: showExpenseForm ? 2 : 0,
        flexShrink: 0,
        transition: 'width 0.4s ease-in-out, margin-left 0.4s ease-in-out',
        overflow: 'hidden',
      }}>
        {showExpenseForm && (
          <ExpenseForm expense={editingExpense} onSave={handleSaveExpense} onClose={handleCloseForm} />
        )}
      </Box>
    </Box>
  );
};

export default BudgetPage;