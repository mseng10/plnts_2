import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useCarePlans } from '../../hooks/useCarePlans';
import { ClipboardList, Type, Droplet, Sprout, SprayCan, Replace } from 'lucide-react';
import { motion } from 'framer-motion';

const NumberInput = ({ label, value, onChange, icon }) => (
    <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{icon}</div>
        <input
            type="number"
            placeholder={label}
            value={value}
            onChange={onChange}
            className="w-full bg-slate-900/50 rounded-lg border border-slate-700 pl-9 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
    </div>
);

const CarePlanCreate = () => {
    const navigate = useNavigate();
    const { createCarePlan, isLoading, error } = useCarePlans();

    const [name, setName] = useState('');
    const [watering, setWatering] = useState('');
    const [fertilizing, setFertilizing] = useState('');
    const [cleaning, setCleaning] = useState('');
    const [potting, setPotting] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!name) return;

        const newCarePlan = {
            name,
            watering: parseInt(watering, 10) || null,
            fertilizing: parseInt(fertilizing, 10) || null,
            cleaning: parseInt(cleaning, 10) || null,
            potting: parseInt(potting, 10) || null,
        };

        try {
            await createCarePlan(newCarePlan);
            navigate("/");
        } catch (err) {
            console.error('Error creating care plan:', err);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    if (isLoading) return <div className="p-4 text-slate-400 text-center">Creating Care Plan...</div>;

    return (
        <div className="p-4 h-full flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl shadow-black/20"
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-sky-500/10 text-sky-500 rounded-2xl flex items-center justify-center">
                            <ClipboardList size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-slate-100">New Care Plan</h2>
                            <p className="text-sm text-slate-400">Define a routine for your plants.</p>
                        </div>
                    </div>

                    <div className="relative">
                        <Type size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input type="text" placeholder="Plan Name (e.g., Tropicals)" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-slate-900/50 rounded-lg border border-slate-700 pl-9 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                    </div>

                    <p className="text-sm font-semibold text-slate-400 -mb-2">Frequencies (in days)</p>
                    <div className="grid grid-cols-2 gap-4">
                        <NumberInput label="Watering" value={watering} onChange={(e) => setWatering(e.target.value)} icon={<Droplet size={16} />} />
                        <NumberInput label="Fertilizing" value={fertilizing} onChange={(e) => setFertilizing(e.target.value)} icon={<Sprout size={16} />} />
                        <NumberInput label="Cleaning" value={cleaning} onChange={(e) => setCleaning(e.target.value)} icon={<SprayCan size={16} />} />
                        <NumberInput label="Potting" value={potting} onChange={(e) => setPotting(e.target.value)} icon={<Replace size={16} />} />
                    </div>

                    {error && <p className="text-sm text-red-400 text-center">{error.message}</p>}

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={handleCancel} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800/60 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed">
                            {isLoading ? 'Saving...' : 'Save Plan'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CarePlanCreate;
