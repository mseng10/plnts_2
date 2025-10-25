import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Edit, Trash2, DollarSign, Ruler, HardDrive, Beaker, ClipboardList, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

const PlantCard = ({ plant, deprecatePlant }) => {
    const navigate = useNavigate();

    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete "${plant.species.name}"?`)) {
            deprecatePlant(plant.id);
        }
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        navigate(`/bubbys/plants/${plant.id}`);
    };

    const getOverdueTasks = () => {
        if (!plant.carePlan) return [];

        const overdue = [];
        const today = dayjs();
        const { watering, fertilizing, cleaning, potting } = plant.carePlan;

        const checkOverdue = (taskName, lastDate, frequency) => {
            if (frequency && today.diff(dayjs(lastDate), 'day') > frequency) {
                overdue.push(taskName);
            }
        };

        checkOverdue('Watering', plant.watered_on, watering);
        checkOverdue('Fertilizing', plant.fertilized_on, fertilizing);
        checkOverdue('Cleaning', plant.cleansed_on, cleaning);
        checkOverdue('Potting', plant.potted_on, potting);

        return overdue;
    };
    const overdueTasks = getOverdueTasks();
    return (
        <motion.div
            onClick={() => navigate(`/bubbys/plants/${plant.id}`)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-900/50 hover:border-slate-700 flex flex-col cursor-pointer"
        >
            <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-emerald-500/10 rounded-2xl border border-slate-700/50 transition-colors group-hover:border-emerald-500/30">
                    <Leaf size={22} className="text-emerald-400" />
                </div>
                <div className="flex-grow min-w-0">
                    <h3 className="text-lg font-bold text-slate-100 truncate transition-colors group-hover:text-emerald-400">{plant.species.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-slate-400">Acquired: {dayjs(plant.created_on).format('MMM D, YYYY')}</p>
                        <span className="text-xs bg-sky-500/10 text-sky-400 font-semibold px-2 py-0.5 rounded-full capitalize">{plant.phase}</span>
                    </div>
                </div>
                <div title={overdueTasks.length > 0 ? `Needs: ${overdueTasks.join(', ')}` : ''}>
                    {overdueTasks.length > 0 && (
                        <AlertTriangle size={20} className="text-amber-400 animate-pulse" />
                    )}
                </div>
            </div>
            <div className="flex-grow space-y-2 text-sm text-slate-400 border-t border-slate-700/50 pt-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div className="flex items-center gap-2"><Ruler size={14} className="text-slate-500" /><span className="font-medium text-slate-300">{plant.size}"</span></div>
                    <div className="flex items-center gap-2"><DollarSign size={14} className="text-slate-500" /><span className="font-medium text-slate-300">${plant.cost ? plant.cost.toFixed(2) : '0.00'}</span></div>
                </div>
                <div className="space-y-1 pt-2 border-t border-slate-700/50 mt-2">
                    <div className="flex items-center gap-2"><HardDrive size={14} className="text-slate-500" /><span>System: <span className="font-medium text-slate-300">{plant.system.name}</span></span></div>
                    <div className="flex items-center gap-2"><Beaker size={14} className="text-slate-500" /><span>Mix: <span className="font-medium text-slate-300">{plant.mix.name}</span></span></div>
                    <div className="flex items-center gap-2"><ClipboardList size={14} className="text-slate-500" /><span>Care: <span className="font-medium text-slate-300">{plant.carePlan.name}</span></span></div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-2 border-t border-slate-700/50 mt-2">
                    <p>Watered: <span className="font-medium text-slate-300">{dayjs(plant.watered_on).format('MMM D, YYYY')}</span></p>
                    <p>Fertilized: <span className="font-medium text-slate-300">{dayjs(plant.fertilized_on).format('MMM D, YYYY')}</span></p>
                    <p>Cleansed: <span className="font-medium text-slate-300">{dayjs(plant.cleansed_on).format('MMM D, YYYY')}</span></p>
                    <p>Potted: <span className="font-medium text-slate-300">{dayjs(plant.potted_on).format('MMM D, YYYY')}</span></p>
                </div>
            </div>
            <div className="border-t border-slate-700/50 mt-6 pt-4 flex justify-end items-center gap-1">
                <button onClick={handleEdit} className="p-2 rounded-full text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 transition-colors"><Edit size={16} /></button>
                <button onClick={handleDelete} className="p-2 rounded-full text-slate-400 hover:bg-slate-700/50 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
            </div>
        </motion.div>
    );
};

export default PlantCard;