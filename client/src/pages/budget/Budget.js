import React, { useState } from 'react';
import { useBudget, EXPENSE_CATEGORIES } from '../../hooks/useBudget';
import { DollarSign, ShoppingCart, Frown, TrendingDown, TrendingUp, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ExpenseForm from './ExpenseForm';
import dayjs from 'dayjs';

const BudgetStatCard = ({ icon, label, value, color }) => (
    <div className={`bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 flex items-center gap-4 shadow-lg shadow-black/20`}>
        <div className={`w-11 h-11 flex items-center justify-center rounded-xl flex-shrink-0 ${color.bg}`}>
            {React.cloneElement(icon, { size: 22, className: color.stroke })}
        </div>
        <div>
            <p className="text-2xl font-semibold text-slate-100">${value.toFixed(2)}</p>
            <p className="text-xs font-medium text-slate-400">{label}</p>
        </div>
    </div>
);

const ExpenseItem = ({ expense, onEdit, onDelete }) => {
    const isNeed = expense.category === EXPENSE_CATEGORIES.NEED;
    return (
        <div className="group flex justify-between items-center bg-slate-900/50 p-3 rounded-lg transition-all hover:bg-slate-900">
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full ${isNeed ? 'bg-sky-500/10 text-sky-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {isNeed ? <ShoppingCart size={16} /> : <Frown size={16} />}
                </div>
                <span className="text-sm text-slate-300">{expense.name}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-200">${parseFloat(expense.cost).toFixed(2)}</span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button onClick={() => onEdit(expense)} className="p-1.5 rounded-full text-slate-400 hover:bg-slate-800 hover:text-slate-200"><Edit size={14} /></button>
                    <button onClick={() => onDelete(expense.id)} className="p-1.5 rounded-full text-slate-400 hover:bg-slate-800 hover:text-red-400"><Trash2 size={14} /></button>
                </div>
            </div>
        </div>
    );
};

const BudgetPage = () => {
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const { budgets, expenses, isLoading, error, createExpense, updateExpense, deleteExpense } = useBudget(currentMonth.format('YYYY-MM'));
    const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);

    if (isLoading) {
        return <div className="p-4 text-slate-400 text-center">Loading budget...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-400 text-center">Error loading budget data.</div>;
    }

    const currentBudget = budgets.length > 0 ? budgets[0] : { cost: 0, remaining: 0 };
    const needs = expenses.filter(e => e.category === EXPENSE_CATEGORIES.NEED);
    const craps = expenses.filter(e => e.category === EXPENSE_CATEGORIES.CRAP);

    const totalNeeds = needs.reduce((sum, e) => sum + parseFloat(e.cost), 0);
    const totalCraps = craps.reduce((sum, e) => sum + parseFloat(e.cost), 0);

    const statColors = {
        remaining: { bg: 'bg-emerald-500/10', stroke: 'text-emerald-500' },
        needs: { bg: 'bg-sky-500/10', stroke: 'text-sky-500' },
        craps: { bg: 'bg-amber-500/10', stroke: 'text-amber-500' },
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

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            await deleteExpense(id);
        }
    };

    return (
        <div className="p-4 h-full flex gap-6">
            <div className="flex-grow flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <button onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))} className="p-2 rounded-full hover:bg-slate-800/50 transition-colors">
                            <ChevronLeft className="text-slate-400" />
                        </button>
                    </motion.div>
                    <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xl font-semibold text-slate-200">
                        {currentMonth.format('MMMM YYYY')}
                    </motion.h2>
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <button onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))} className="p-2 rounded-full hover:bg-slate-800/50 transition-colors">
                            <ChevronRight className="text-slate-400" />
                        </button>
                    </motion.div>
                </div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <BudgetStatCard icon={<DollarSign />} label="Remaining" value={parseFloat(currentBudget.remaining)} color={statColors.remaining} />
                    <BudgetStatCard icon={<TrendingUp />} label="Needs" value={totalNeeds} color={statColors.needs} />
                    <BudgetStatCard icon={<TrendingDown />} label="Craps" value={totalCraps} color={statColors.craps} />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl shadow-black/30 flex-grow flex flex-col min-h-0">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-slate-300">Expenses for {currentMonth.format('MMMM')}</h2>
                        <button onClick={() => handleOpenForm()} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition-colors">
                            <Plus size={16} /> Add Expense
                        </button>
                    </div>
                    <div className="overflow-y-auto flex-grow pr-2 -mr-4 space-y-3 flex-1">
                        {expenses.length > 0 ? (
                            expenses.map(expense => <ExpenseItem key={expense.id} expense={expense} onEdit={handleOpenForm} onDelete={handleDelete} />)
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <ShoppingCart size={40} className="text-slate-600 mb-2" />
                                <p className="text-sm font-medium text-slate-500">No expenses recorded yet.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
            <AnimatePresence>
                {showExpenseForm && (
                    <motion.div
                        className="w-80 flex-shrink-0"
                        initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                        animate={{ width: 320, opacity: 1, marginLeft: 16 }}
                        exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        <ExpenseForm expense={editingExpense} onSave={handleSaveExpense} onClose={handleCloseForm} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BudgetPage;