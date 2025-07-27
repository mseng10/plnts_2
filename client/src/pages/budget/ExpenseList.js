import React from 'react';
import { List, ListItem, ListItemText, IconButton, Paper, Typography, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ExpenseList = ({ title, expenses, onEdit, onDelete }) => {
  const titleColor = title === 'Needed' ? 'info.main' : 'warning.main';

  return (
    <Paper sx={{ p: 2, backgroundColor: 'rgba(0,0,0,0.2)', height: '100%' }}>
      <Typography variant="h5" sx={{ mb: 2, color: titleColor }}>{title}</Typography>
      <Box sx={{ maxHeight: 'calc(100vh - 350px)', overflowY: 'auto' }}>
        <List>
          {expenses.map((expense) => (
            <ListItem
              key={expense.id}
              secondaryAction={
                <>
                  <IconButton edge="end" aria-label="edit" onClick={() => onEdit(expense)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => onDelete(expense.id)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              }
              sx={{ backgroundColor: 'rgba(255,255,255,0.05)', mb: 1, borderRadius: 1 }}
            >
              <ListItemText
                primary={expense.name}
                secondary={`$${expense.cost.toFixed(2)}`}
                primaryTypographyProps={{color: 'text.primary'}}
                secondaryTypographyProps={{color: 'text.secondary'}}
              />
            </ListItem>
          ))}
          {expenses.length === 0 && 
            <Typography sx={{textAlign: 'center', color: 'text.secondary', mt: 2}}>
              No expenses here.
            </Typography>
          }
        </List>
      </Box>
    </Paper>
  );
};

export default ExpenseList;