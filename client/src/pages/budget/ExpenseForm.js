// import { useState, useEffect } from 'react';
// import { Paper, Stack, TextField, MenuItem, Button, IconButton, Box, Typography } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import { EXPENSE_CATEGORIES } from '../../hooks/useBudget';
// import dayjs from 'dayjs';
// import { FormTextInput, TextAreaInput, DateSelector } from '../../elements/Form';

// const ExpenseForm = ({ expense, onSave, onClose }) => {
//     const [name, setName] = useState('');
//     const [cost, setCost] = useState('');
//     const [category, setCategory] = useState(EXPENSE_CATEGORIES.NEED);
//     const [purchasedOn, setPurchasedOn] = useState(dayjs());

//     useEffect(() => {
//         if (expense) {
//             setName(expense.name);
//             setCost(expense.cost);
//             setCategory(expense.category);
//             setPurchasedOn(dayjs(expense.purchased_on));
//         } else {
//             // Reset for new expense
//             setName('');
//             setCategory(EXPENSE_CATEGORIES.NEED);
//         }
//     }, [expense]);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const expenseData = {
//             name,
//             cost: parseFloat(cost),
//             category,
//             purchased_on: purchasedOn.toISOString()
//         };
//         if (expense) {
//             expenseData.id = expense.id;
//         }
//         onSave(expenseData);
//     };

//     return (
//         <Paper sx={{
//             width: '100%',
//             p: 2,
//             borderRadius: 4,
//             border: '1px solid rgba(255, 255, 255, 0.2)',
//             backgroundColor: 'rgba(255, 255, 255, 0.1)',
//             backdropFilter: 'blur(10px)',
//             transition: 'all 0.3s ease-in-out',
//             maxHeight: 'calc(100vh - 32px)',
//             display: 'flex',
//             flexDirection: 'column'
//         }}>
//             <Box sx={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 pb: 2,
//                 borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
//                 flexShrink: 0
//             }}>
//                 <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
//                     {expense ? 'Edit Expense' : 'Add Expense'}
//                 </Typography>
//                 <IconButton onClick={onClose} sx={{ color: 'white' }}>
//                     <CloseIcon />
//                 </IconButton>
//             </Box>
            
//             <Box component="form" onSubmit={handleSubmit} sx={{ overflowY: 'auto', flexGrow: 1, p: 2, pt: 3 }}>
//                 <Stack spacing={3}>
//                     <TextField
//                         label="Expense Name"
//                         variant="outlined"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         required
//                     />
//                     <TextField
//                         label="Cost"
//                         variant="outlined"
//                         type="number"
//                         value={cost}
//                         onChange={(e) => setCost(e.target.value)}
//                         required
//                         inputProps={{ step: '0.01' }}
//                     />
//                     <TextField
//                         label="Category"
//                         variant="outlined"
//                         select
//                         value={category}
//                         onChange={(e) => setCategory(e.target.value)}
//                     >
//                         <MenuItem value={EXPENSE_CATEGORIES.NEED}>Needed</MenuItem>
//                         <MenuItem value={EXPENSE_CATEGORIES.CRAP}>Crap</MenuItem>
//                     </TextField>
//                     <DateSelector label="Pruchased On" value={purchasedOn} setValue={setPurchasedOn} />
//                     <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
//                         <Button onClick={onClose} color="secondary">Cancel</Button>
//                         <Button type="submit" variant="contained" color="primary">Save</Button>
//                     </Box>
//                 </Stack>
//             </Box>
//         </Paper>
//     );
// };

// export default ExpenseForm;
