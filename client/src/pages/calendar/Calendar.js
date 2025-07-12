import React, { useState, useMemo } from 'react';
import { useTodos } from '../../hooks/useTodos';
import { Loading, ServerError } from '../../elements/Page';
import { Box, Grid, Typography, IconButton, Paper, List, ListItem, ListItemText, Tooltip } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

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

const Calendar = () => {
  const { todos, isLoading, error } = useTodos();
  const [currentDate, setCurrentDate] = useState(dayjs());
  const navigate = useNavigate();

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

  if (isLoading) return <Loading />;
  if (error) return <ServerError />;

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Box sx={{ p: 3, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
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

          return (
            <Grid item xs={1} key={index}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  height: '100%', 
                  minHeight: 150,
                  p: 1,
                  opacity: isCurrentMonth ? 1 : 0.6,
                  backgroundColor: isToday ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Typography variant="body1" sx={{ color: isToday ? 'secondary.main' : 'white', fontWeight: 'bold' }}>
                  {date.format('D')}
                </Typography>
                <List dense disablePadding sx={{ overflowY: 'auto', flex: 1 }}>
                  {dayTodos.map(todo => (
                    <Tooltip key={todo.id} title={todo.name} placement="top">
                      <ListItem button onClick={() => navigate(`/todos/${todo.id}`)} sx={{ p: '2px 4px', borderRadius: 1, mb: 0.5, backgroundColor: 'rgba(0,0,0,0.2)' }}>
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
  );
};

export default Calendar;