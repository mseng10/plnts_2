import React from 'react';
import { List, ListItem, ListItemText, IconButton, Paper, Typography, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ExpenseList = ({ title, expenses, onEdit, onDelete }) => {
    const titleColor = title === 'Needed' ? 'info.main' : 'warning.main';

    return (
        <Paper sx={{
            p: 2,
            height: '100%',
            borderRadius: 4,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Typography variant="h5" sx={{ mb: 2, color: titleColor, flexShrink: 0 }}>
                {title}
            </Typography>
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                <List>
                    {expenses.map((expense) => (
                        <ListItem
                            key={expense.id}
                            secondaryAction={
                                <>
                                    <IconButton edge="end" aria-label="edit" onClick={() => onEdit(expense)} sx={{color: 'white'}}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton edge="end" aria-label="delete" onClick={() => onDelete(expense.id)} sx={{color: 'white'}}>
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            }
                            sx={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                                mb: 1, 
                                borderRadius: 2 
                            }}
                        >
                            <ListItemText
                                primary={expense.name}
                                secondary={`$${expense.cost.toFixed(2)}`}
                                primaryTypographyProps={{ color: 'white' }}
                                secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.7)' }}
                            />
                        </ListItem>
                    ))}
                    {expenses.length === 0 &&
                        <Typography sx={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', mt: 2 }}>
                            No expenses here.
                        </Typography>
                    }
                </List>
            </Box>
        </Paper>
    );
};

export default ExpenseList;
