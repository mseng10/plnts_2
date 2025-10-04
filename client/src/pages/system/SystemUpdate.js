import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useSystems, useLights } from '../../hooks/useSystems';
import { ShieldCheck, Type, AlignLeft, Sun, Plus, Trash2, Thermometer, Droplet } from 'lucide-react';
import { motion } from 'framer-motion';

const SliderInput = ({ label, value, onChange, min, max, step, icon }) => (
    <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
            {icon} {label}: <span className="font-semibold text-emerald-400">{value}</span>
        </label>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
    </div>
);

const SystemUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { systems, updateSystem, isLoading, error, setError } = useSystems();
    const { lights, isLoading: lightsLoading } = useLights();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [target_humidity, setHumidity] = useState(60);
    const [target_temperature, setTemperature] = useState(68);
    const [duration, setDuration] = useState(12);
    const [distance, setDistance] = useState(24);
    const [systemLights, setSystemLights] = useState([{ light_id: '' }]);

    useEffect(() => {
        const system = systems.find(s => String(s.id) === id);
        if (system) {
            setName(system.name || '');
            setDescription(system.description || '');
            setHumidity(system.target_humidity || 60);
            setTemperature(system.target_temperature || 68);
            setDuration(system.duration || 12);
            setDistance(system.distance || 24);
            const initialLights = system.lights?.map(light => ({ light_id: light.id })) || [{ light_id: '' }];
            setSystemLights(initialLights.length > 0 ? initialLights : [{ light_id: '' }]);
        }
    }, [id, systems]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        if (!name) {
            setError({ message: "System name is required." });
            return;
        }

        const light_ids = systemLights
            .map(item => item.light_id ? parseInt(item.light_id, 10) : null)
            .filter(id => id !== null);

        try {
            await updateSystem({ id, name, description, target_humidity, target_temperature, distance, duration, light_ids });
            navigate("/bubbys/systems");
        } catch (err) {
            console.error('Error updating system:', err);
        }
    };

    const handleCancel = () => navigate("/bubbys/systems");
    const addLight = () => setSystemLights(prev => [...prev, { light_id: '' }]);
    const removeLight = (index) => setSystemLights(prev => prev.filter((_, i) => i !== index));
    const updateLight = (index, value) => {
        setSystemLights(prev => {
            const newLights = [...prev];
            newLights[index].light_id = value;
            return newLights;
        });
    };

    if (isLoading || lightsLoading) return <div className="p-4 text-slate-400 text-center">Loading...</div>;

    return (
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl shadow-black/20 flex flex-col">
            <div className="flex items-center gap-4 mb-6 flex-shrink-0">
                <div className="w-14 h-14 bg-green-500/10 text-green-400 rounded-2xl flex items-center justify-center"><ShieldCheck size={28} /></div>
                <div>
                    <h2 className="text-xl font-semibold text-slate-100">Edit System</h2>
                    <p className="text-sm text-slate-400">Update the environment details.</p>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-grow min-h-0">
                <div className="space-y-4 flex-grow overflow-y-auto overflow-x-hidden pr-2 -mr-4">
                    <div className="relative">
                        <Type size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input type="text" placeholder="System Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-slate-900/50 rounded-lg border border-slate-700 pl-9 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                    </div>
                    <div className="relative">
                        <AlignLeft size={16} className="absolute left-3 top-3 text-slate-500" />
                        <textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} rows="2" className="w-full bg-slate-900/50 rounded-lg border border-slate-700 pl-9 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none" />
                    </div>
                    <SliderInput label="Humidity" value={target_humidity} onChange={(e) => setHumidity(e.target.value)} min={0} max={100} icon={<Droplet size={16} />} />
                    <SliderInput label="Temperature" value={target_temperature} onChange={(e) => setTemperature(e.target.value)} min={48} max={80} step={2} icon={<Thermometer size={16} />} />
                    <SliderInput label="Light Duration (hours)" value={duration} onChange={(e) => setDuration(e.target.value)} min={6} max={18} icon={<Sun size={16} />} />
                    <SliderInput label="Light Distance (inches)" value={distance} onChange={(e) => setDistance(e.target.value)} min={12} max={36} step={2} icon={<Sun size={16} />} />
                    
                    <h3 className="text-base font-semibold text-slate-300 pt-2">Lights</h3>
                    <div className="space-y-3">
                        {systemLights.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <select value={item.light_id} onChange={(e) => updateLight(index, e.target.value)} className="flex-grow bg-slate-900/50 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                                    <option value="">Select Light...</option>
                                    {lights.map(light => <option key={light.id} value={light.id}>{light.name}</option>)}
                                </select>
                                <button type="button" onClick={() => removeLight(index)} className="p-2 text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addLight} className="mt-2 flex self-center items-center gap-2 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-semibold transition-colors"><Plus size={16} /> Add Light</button>
                </div>
                {error && <p className="text-sm text-red-400 text-center">{error.message}</p>}
                <div className="flex justify-end gap-3 pt-4 flex-shrink-0">
                    <button type="button" onClick={handleCancel} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800/60 transition-colors">Cancel</button>
                    <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed">{isLoading ? 'Saving...' : 'Save Changes'}</button>
                </div>
            </form>
        </motion.div>
    );
};

export default SystemUpdate;