import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Edit, Trash2, Blocks as BlocksIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const soilColors = [
    'text-red-400', 'text-orange-400', 'text-amber-400', 'text-lime-400', 
    'text-emerald-400', 'text-teal-400', 'text-cyan-400', 'text-sky-400', 
    'text-blue-400', 'text-indigo-400', 'text-violet-400', 'text-purple-400', 
    'text-fuchsia-400', 'text-pink-400', 'text-rose-400'
];
const getSoilColor = (soilId) => soilId ? soilColors[parseInt(soilId, 10) % soilColors.length] : 'text-slate-400';

const MixCard = ({ mix, deprecateMix, soils }) => {
    const navigate = useNavigate();

    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete the "${mix.name}" mix?`)) {
            deprecateMix(mix.id);
        }
    };

    const totalParts = mix.soil_parts.reduce((sum, part) => sum + part.parts, 0);

    const getSoilName = (soilId) => {
        return soils?.find(s => s.id === soilId)?.name || 'Unknown Soil';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 flex flex-col"
        >
            <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-amber-500/10 rounded-2xl border border-slate-700/50">
                    <Layers size={22} className="text-amber-400" />
                </div>
                <div className="flex-grow min-w-0">
                    <h3 className="text-lg font-semibold text-slate-100 truncate">{mix.name}</h3>
                    <p className="text-sm text-slate-400">{mix.soil_parts.length} ingredients</p>
                </div>
            </div>
            <div className="flex-grow space-y-2">
                {mix.soil_parts.map(part => (
                    <div key={part.id} className="flex items-center text-sm bg-slate-900/50 px-3 py-1.5 rounded-md">
                        <BlocksIcon size={16} className={`mr-2 flex-shrink-0 ${getSoilColor(part.soil_id)}`} />
                        <span className="text-slate-300 flex-grow">{getSoilName(part.soil_id)}</span>
                        <span className="font-mono text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">{Math.round((part.parts / totalParts) * 100)}%</span>
                    </div>
                ))}
            </div>
            <div className="border-t border-slate-700/50 mt-6 pt-4 flex justify-end items-center gap-1">
                <button onClick={() => navigate(`/bubbys/mixes/${mix.id}`)} className="p-2 rounded-full text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 transition-colors"><Edit size={16} /></button>
                <button onClick={handleDelete} className="p-2 rounded-full text-slate-400 hover:bg-slate-700/50 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
            </div>
        </motion.div>
    );
};

export default MixCard;