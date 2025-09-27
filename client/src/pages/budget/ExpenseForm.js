import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, DollarSign, ShoppingCart, Frown } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '../../hooks/useBudget';
import dayjs from 'dayjs';

const ExpenseForm = ({ expense, onSave, onClose }) => {
    const [name, setName] = useState('');
    const [cost, setCost] = useState('');
    const [category, setCategory] = useState(EXPENSE_CATEGORIES.NEED);
    const [purchasedOn, setPurchasedOn] = useState(dayjs().format('YYYY-MM-DD'));

    useEffect(() => {
        if (expense) {
            setName(expense.name);
            setCost(expense.cost);
            setCategory(expense.category);
            setPurchasedOn(dayjs(expense.purchased_on).format('YYYY-MM-DD'));
        } else {
            setName('');
            setCost('');
            setCategory(EXPENSE_CATEGORIES.NEED);
            setPurchasedOn(dayjs().format('YYYY-MM-DD'));
        }
    }, [expense]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const expenseData = {
            name,
            cost: parseFloat(cost),
            category,
            purchased_on: dayjs(purchasedOn).toISOString()
        };
        if (expense) {
            expenseData.id = expense.id;
        }
        onSave(expenseData);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl shadow-black/30 flex flex-col h-full"
        >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-slate-100">{expense ? 'Edit Expense' : 'Add New Expense'}</h3>
                <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-700/50 transition-colors">
                    <X size={18} className="text-slate-400" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-grow gap-4">
                <input type="text" placeholder="Expense Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-slate-900/50 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                <input type="number" placeholder="Cost" value={cost} onChange={(e) => setCost(e.target.value)} required step="0.01" className="w-full bg-slate-900/50 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                <input type="date" value={purchasedOn} onChange={(e) => setPurchasedOn(e.target.value)} required className="w-full bg-slate-900/50 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                
                <div className="flex gap-2">
                    <button type="button" onClick={() => setCategory(EXPENSE_CATEGORIES.NEED)} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${category === EXPENSE_CATEGORIES.NEED ? 'bg-sky-500/20 text-sky-400' : 'bg-slate-800/50 hover:bg-slate-800 text-slate-400'}`}>
                        <ShoppingCart size={14} /> Need
                    </button>
                    <button type="button" onClick={() => setCategory(EXPENSE_CATEGORIES.CRAP)} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${category === EXPENSE_CATEGORIES.CRAP ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800/50 hover:bg-slate-800 text-slate-400'}`}>
                        <Frown size={14} /> Crap
                    </button>
                </div>

                <div className="mt-auto flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800/60 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors">
                        Save Expense
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default ExpenseForm;