import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplet, Sprout, SprayCan, Replace, Edit, Trash2, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';

const CarePlanCard = ({ carePlan, deprecateCarePlan }) => {
    const navigate = useNavigate();

    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete the "${carePlan.name}" care plan?`)) {
            deprecateCarePlan(carePlan.id);
        }
    };

    const careActions = [
        { label: 'Watering', value: carePlan.watering, icon: <Droplet size={22} className="text-sky-400" /> },
        { label: 'Fertilizing', value: carePlan.fertilizing, icon: <Sprout size={22} className="text-lime-400" /> },
        { label: 'Cleaning', value: carePlan.cleaning, icon: <SprayCan size={22} className="text-amber-400" /> },
        { label: 'Potting', value: carePlan.potting, icon: <Replace size={22} className="text-slate-400" /> },
    ].filter(action => action.value);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-purple-900/50 hover:border-slate-700"
        >
            <div className="flex items-center gap-3 mb-6">
                <ClipboardList size={20} className="text-purple-400 flex-shrink-0" />
                <h3 className="text-lg font-semibold text-slate-100 truncate transition-colors group-hover:text-purple-400">{carePlan.name}</h3>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 flex-grow">
                {careActions.map(action => (
                    <div key={action.label} className="flex items-center gap-4">
                        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-slate-900/50 rounded-2xl border border-slate-700/50">
                           {action.icon}
                        </div>
                        <div className="flex-grow min-w-0">
                            <p className="text-sm font-semibold text-slate-200">{action.label}</p>
                            <p className="text-xs text-slate-400">Every <span className="font-bold text-slate-300">{action.value}</span> days</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="border-t border-slate-700/50 mt-6 pt-4 flex justify-end items-center gap-1">
                <button onClick={() => navigate(`/bubbys/care-plans/${carePlan.id}`)} className="p-2 rounded-full text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 transition-colors"><Edit size={16} /></button>
                <button onClick={handleDelete} className="p-2 rounded-full text-slate-400 hover:bg-slate-700/50 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
            </div>
        </motion.div>
    );
};

export default CarePlanCard;