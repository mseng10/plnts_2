import React, { useState, useMemo } from 'react';
import { useTodos } from '../../hooks/useTodos';
import { Loading, ServerError } from '../../elements/Page';
import { Box, Grid, Typography, IconButton, Paper, List, ListItem, ListItemText, Tooltip } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import dayjs from 'dayjs';
import TodoCard from '../todo/TodoCard';

// Helper to group todos by date for efficient lookup
const groupTodosByDate = (todos) => {
  if (!todos) return {};
  return todos.reduce((acc, todo) => {
    const date = dayjs(todo.due_on).format('YYYY-MM-DD');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(todo);
    return acc;
  }, {});
};

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar = () => {
  const { todos, isLoading, error, resolveTodo } = useTodos();
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedTodo, setSelectedTodo] = useState(null);

  const handleTodoClick = (todo) => {
    // If the same todo is clicked again, hide the card. Otherwise, show the new one.
    setSelectedTodo(prev => (prev && prev.id === todo.id ? null : todo));
  };
  
  const todosByDate = useMemo(() => groupTodosByDate(todos), [todos]);

  const calendarDays = useMemo(() => {
    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');
    const startOfWeek = startOfMonth.startOf('week');
    const endOfWeek = endOfMonth.endOf('week');

    const days = [];
    let day = startOfWeek;

    while (day.isBefore(endOfWeek, 'day') || day.isSame(endOfWeek, 'day')) {
      days.push(day);
      day = day.add(1, 'day');
    }
    return days;
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'));
  };

  const handleResolve = (todoId) => {
    resolveTodo(todoId);
    setSelectedTodo(null);
  };

  if (isLoading) return <Loading />;
  if (error) return <ServerError />;

  return (
    <Box sx={{ display: 'flex', p: 2, height: '100%' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Calendar Header */}
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

        {/* Weekday Headers */}
        <Grid container columns={7}>
          {weekdays.map(weekday => (
            <Grid item xs={1} key={weekday}>
              <Typography variant="h6" align="center" sx={{ color: 'white', fontWeight: 'bold' }}>
                {weekday}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* Calendar Grid */}
        <Grid container columns={7} spacing={1} sx={{ flexGrow: 1 }}>
          {calendarDays.map((date, index) => {
            const dateKey = date.format('YYYY-MM-DD');
            const dayTodos = todosByDate[dateKey] || [];
            const isCurrentMonth = date.isSame(currentDate, 'month');
            const isToday = date.isSame(dayjs(), 'day');
            const isPastDue = dayTodos.length > 0 && date.isBefore(dayjs(), 'day');

            return (
              <Grid item xs={1} key={index}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    height: '100%', 
                    minHeight: 150,
                    p: 1,
                    opacity: isCurrentMonth ? 1 : 0.6,
                    backgroundColor: isToday ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid',
                    borderColor: isPastDue ? 'error.main' : 'rgba(255, 255, 255, 0.2)',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Typography variant="body1" sx={{ color: isPastDue ? 'error.main' : (isToday ? 'secondary.main' : 'white'), fontWeight: 'bold' }}>
                    {date.format('D')}
                  </Typography>
                  <List dense disablePadding sx={{ overflowY: 'auto', flex: 1 }}>
                    {dayTodos.map(todo => (
                      <Tooltip key={todo.id} title={todo.name} placement="top">
                        <ListItem button onClick={() => handleTodoClick(todo)} sx={{ p: '2px 4px', borderRadius: 1, mb: 0.5, backgroundColor: 'rgba(0,0,0,0.2)' }}>
                          <ListItemText primary={todo.name} primaryTypographyProps={{ noWrap: true, variant: 'caption', sx: { color: 'white' } }} />
                        </ListItem>
                      </Tooltip>
                    ))}
                  </List>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>
      <Box sx={{
        width: selectedTodo ? 300 : 0,
        marginLeft: selectedTodo ? 2 : 0,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        transition: 'width 0.4s ease-in-out, margin-left 0.4s ease-in-out',
        overflow: 'hidden',
      }}>
        {selectedTodo && <TodoCard todo={selectedTodo} onResolve={handleResolve} />}
      </Box>
    </Box>
  );
};

export default Calendar;