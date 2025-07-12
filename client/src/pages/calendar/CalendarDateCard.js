import React from 'react';
import { Box, Card, CardContent, CardHeader, Typography, List, ListItem } from '@mui/material';
import TodoCard from '../todo/TodoCard';

const CalendarDateCard = ({ date, todos, onResolve }) => {
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
        title={date.format('dddd, MMMM D, YYYY')}
        titleTypographyProps={{ variant: 'h5', color: 'primary' }}
        sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)', flexShrink: 0 }}
      />
      <CardContent sx={{ overflowY: 'auto', flexGrow: 1 }}>
        {todos && todos.length > 0 ? (
          <List disablePadding>
            {todos.map((todo) => (
              <ListItem key={todo.id} disablePadding sx={{ justifyContent: 'center', mb: 2 }}>
                <TodoCard todo={todo} onResolve={onResolve} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', pt: 4 }}>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              No events for this day.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarDateCard;