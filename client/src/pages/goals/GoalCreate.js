import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import { useGoals } from '../../hooks/useGoals';
import { Flag, Type, AlignLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const GoalCreate = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [dueMonth, setDueMonth] = useState(dayjs().format('YYYY-MM'));
    const navigate = useNavigate();
    const { createGoal, isLoading, error } = useGoals();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!name) return;

        try {
            const newGoal = {
                name,
                description,
                due_month: dueMonth, 
            };
            await createGoal(newGoal);
            navigate("/calendar");
        } catch (err) {
            console.error("Failed to create goal:", err);
        }
    };

    const handleCancel = () => {
        navigate(-1); // Go back to the previous page
    };

    if (isLoading) return <div className="p-4 text-slate-400 text-center">Creating goal...</div>;

    return (
        <div className="p-4 h-full flex items-center justify-center">
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="w-full max-w-lg bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl shadow-black/20"
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center">
                            <Flag size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-slate-100">Create a New Goal</h2>
                            <p className="text-sm text-slate-400">Set a target for the month.</p>
                        </div>
                    </div>

                    <div className="relative">
                        <Type size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input type="text" placeholder="Goal Name (e.g., Repot 5 plants)" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-slate-900/50 rounded-lg border border-slate-700 pl-9 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                    </div>
                    <div className="relative">
                        <AlignLeft size={16} className="absolute left-3 top-3 text-slate-500" />
                        <textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="w-full bg-slate-900/50 rounded-lg border border-slate-700 pl-9 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none" />
                    </div>
                    <input type="month" value={dueMonth} onChange={(e) => setDueMonth(e.target.value)} required className="w-full bg-slate-900/50 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />

                    {error && <p className="text-sm text-red-400 text-center">{error.message}</p>}

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={handleCancel} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800/60 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed">
                            {isLoading ? 'Saving...' : 'Save Goal'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default GoalCreate;
