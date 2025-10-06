import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useMixes, useSoils } from '../../hooks/useMix';
import { Layers, Type, AlignLeft, Plus, Minus, Trash2, Blocks as BlocksIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const soilColors = [
    'text-red-400', 'text-orange-400', 'text-amber-400', 'text-lime-400', 
    'text-emerald-400', 'text-teal-400', 'text-cyan-400', 'text-sky-400', 
    'text-blue-400', 'text-indigo-400', 'text-violet-400', 'text-purple-400', 
    'text-fuchsia-400', 'text-pink-400', 'text-rose-400'
];
const getSoilColor = (soilId) => soilId ? soilColors[parseInt(soilId, 10) % soilColors.length] : 'text-slate-400';

const MixCreate = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [soilsByParts, setSoilsByParts] = useState([{ soil_id: '', parts: 1 }]);

    const navigate = useNavigate();
    const { error, createMix, setError, isLoading } = useMixes();
    const { soils, isLoading: soilsLoading } = useSoils();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        if (!name) {
            setError({ message: "Mix name is a required field." });
            return;
        }

        const soil_parts = soilsByParts
            .filter(part => part.soil_id && part.parts > 0)
            .map(part => ({
                soil_id: parseInt(part.soil_id, 10),
                parts: part.parts
            }));
        
        if (soil_parts.length === 0) {
            setError({ message: "You must add at least one soil ingredient." });
            return;
        }

        try {
            await createMix({ name, description, experimental: false, soil_parts });
            navigate("/");
        } catch (err) {
            console.error("Failed to create mix:", err);
        }
    };

    const handleCancel = () => navigate(-1);

    const addSoilPart = () => setSoilsByParts(prev => [...prev, { soil_id: '', parts: 1 }]);
    const removeSoilPart = (index) => setSoilsByParts(prev => prev.filter((_, i) => i !== index));

    const updateSoilPart = (index, field, value) => {
        setSoilsByParts(prev => {
            const newParts = [...prev];
            newParts[index] = { ...newParts[index], [field]: value };
            return newParts;
        });
    };

    const handlePartCountChange = (index, delta) => {
        setSoilsByParts(prev => {
            const newParts = [...prev];
            const currentParts = newParts[index].parts;
            if (currentParts + delta > 0) {
                newParts[index].parts = currentParts + delta;
            }
            return newParts;
        });
    };

    if (isLoading || soilsLoading) return <div className="p-4 text-slate-400 text-center">Loading...</div>;

    return (
        <div className="p-4 h-full flex items-center justify-center">
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="w-full max-w-4xl"
            >
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    {/* --- MAIN FORM CARD --- */}
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl shadow-black/20 flex flex-col gap-6 md:col-span-2">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center">
                                <Layers size={28} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-slate-100">Create a New Mix</h2>
                                <p className="text-sm text-slate-400">Combine soils to create the perfect medium.</p>
                            </div>
                        </div>
                        <div className="relative">
                            <Type size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input type="text" placeholder="Mix Name (e.g., Aroid Mix)" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-slate-900/50 rounded-lg border border-slate-700 pl-9 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                        </div>
                        <div className="relative">
                            <AlignLeft size={16} className="absolute left-3 top-3 text-slate-500" />
                            <textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="w-full bg-slate-900/50 rounded-lg border border-slate-700 pl-9 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none" />
                        </div>
                        {error && <p className="text-sm text-red-400 text-center">{error.message}</p>}
                        <div className="flex justify-end gap-3 pt-4 mt-auto">
                            <button type="button" onClick={handleCancel} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800/60 transition-colors">Cancel</button>
                            <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed">
                                {isLoading ? 'Saving...' : 'Save Mix'}
                            </button>
                        </div>
                    </div>

                    {/* --- SOIL PARTS PANEL --- */}
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl shadow-black/20 flex flex-col md:col-span-3">
                        <h3 className="text-lg font-semibold text-slate-300 mb-4">Soil Ingredients</h3>
                        <div className="space-y-3 overflow-y-auto flex-grow pr-2 -mr-4">
                            {soilsByParts.map((part, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <BlocksIcon size={20} className={getSoilColor(part.soil_id)} />
                                    <select value={part.soil_id} onChange={(e) => updateSoilPart(index, 'soil_id', e.target.value)} className="flex-grow bg-slate-900/50 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                                        <option value="">Select Soil...</option>
                                        {soils.map(soil => <option key={soil.id} value={soil.id}>{soil.name}</option>)}
                                    </select>
                                    <div className="flex items-center gap-1 bg-slate-900/50 rounded-lg border border-slate-700">
                                        <button type="button" onClick={() => handlePartCountChange(index, -1)} className="p-2 text-slate-400 hover:text-white"><Minus size={14} /></button>
                                        <span className="text-sm font-semibold text-slate-200 w-6 text-center">{part.parts}</span>
                                        <button type="button" onClick={() => handlePartCountChange(index, 1)} className="p-2 text-slate-400 hover:text-white"><Plus size={14} /></button>
                                    </div>
                                    <button type="button" onClick={() => removeSoilPart(index)} className="p-2 text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addSoilPart} className="mt-4 flex self-center items-center gap-2 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-semibold transition-colors">
                            <Plus size={16} /> Add Ingredient
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default MixCreate;
