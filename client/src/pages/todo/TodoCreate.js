import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import { useTodos } from '../../hooks/useTodos';
import { useGoals } from '../../hooks/useGoals';
import { ListTodo, Type, AlignLeft, Flag, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const TodoCreate = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [tasks, setTasks] = useState([]);
    const [dueOn, setDueOn] = useState(dayjs().format('YYYY-MM-DD'));
    const [goalId, setGoalId] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { createTodo, isLoading } = useTodos();
    const { goals, isLoading: goalsLoading } = useGoals();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        if (!name) {
            setError("Title is a required field.");
            return;
        }

        try {
            const finalTasks = tasks.filter(task => task.description.trim() !== '');
            const newTodo = {
                name,
                description,
                due_on: dayjs(dueOn).toISOString(),
                tasks: finalTasks,
                goal_id: goalId ? parseInt(goalId, 10) : null
            };
            await createTodo(newTodo);
            navigate("/calendar");
        } catch (err) {
            setError("Failed to create todo. Please try again.");
            console.error(err);
        }
    };

    const handleCancel = () => navigate(-1);
    const addTask = () => setTasks(prev => [...prev, { description: "" }]);
    const removeTask = (index) => setTasks(prev => prev.filter((_, i) => i !== index));
    const updateTask = (description, index) => {
        setTasks(prev => prev.map((task, i) => i === index ? { ...task, description } : task));
    };

    if (isLoading || goalsLoading) return <div className="p-4 text-slate-400 text-center">Loading...</div>;

    return (
        <div className="p-4 h-full flex items-center justify-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* --- MAIN FORM CARD --- */}
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl shadow-black/20 flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center">
                                <ListTodo size={28} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-slate-100">Create a New Todo</h2>
                                <p className="text-sm text-slate-400">Organize your tasks and link them to goals.</p>
                            </div>
                        </div>
                        <div className="relative">
                            <Type size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input type="text" placeholder="Todo Title" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-slate-900/50 rounded-lg border border-slate-700 pl-9 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                        </div>
                        <div className="relative">
                            <AlignLeft size={16} className="absolute left-3 top-3 text-slate-500" />
                            <textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="w-full bg-slate-900/50 rounded-lg border border-slate-700 pl-9 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none" />
                        </div>
                        <input type="date" value={dueOn} onChange={(e) => setDueOn(e.target.value)} required className="w-full bg-slate-900/50 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                        <div className="relative">
                            <Flag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <select value={goalId} onChange={(e) => setGoalId(e.target.value)} className="w-full bg-slate-900/50 rounded-lg border border-slate-700 pl-9 pr-3 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                                <option value="">Link to a goal (optional)</option>
                                {goals.map(goal => <option key={goal.id} value={goal.id}>{goal.name}</option>)}
                            </select>
                        </div>
                        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                        <div className="flex justify-end gap-3 pt-4 mt-auto">
                            <button type="button" onClick={handleCancel} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800/60 transition-colors">Cancel</button>
                            <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed">
                                {isLoading ? 'Saving...' : 'Save Todo'}
                            </button>
                        </div>
                    </div>

                    {/* --- TASKS PANEL --- */}
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl shadow-black/20 flex flex-col">
                        <h3 className="text-lg font-semibold text-slate-300 mb-4">Sub-tasks</h3>
                        <div className="space-y-3 overflow-y-auto flex-grow pr-2 -mr-4">
                            {tasks.map((task, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input type="text" placeholder={`Task ${index + 1}`} value={task.description} onChange={(e) => updateTask(e.target.value, index)} className="flex-grow bg-slate-900/50 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                                    <button type="button" onClick={() => removeTask(index)} className="p-2 text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addTask} className="mt-4 flex self-center items-center gap-2 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-semibold transition-colors">
                            <Plus size={16} /> Add Task
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default TodoCreate;
