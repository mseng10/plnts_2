import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { usePlants, useSpecies } from '../../hooks/usePlants';
import { useCarePlans } from '../../hooks/useCarePlans';
import { PHASE_LABELS } from '../../constants';
import { useMixes } from '../../hooks/useMix';
import SpeciesCreateCard from './species/SpeciesCreateCard';
import { Leaf, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

const AutoCompleteInput = ({ label, value, setValue, options }) => (
    <select value={value ? value.id : ''} onChange={(e) => setValue(options.find(opt => String(opt.id) === e.target.value) || null)} className="w-full bg-slate-900/50 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
        <option value="">Select {label}...</option>
        {options.map(option => <option key={option.id} value={option.id}>{option.name}</option>)}
    </select>
);

const DropdownInput = ({ label, value, setValue, options }) => (
    <select value={value} onChange={(e) => setValue(e.target.value)} className="w-full bg-slate-900/50 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
        {options.map(option => <option key={option} value={option}>{option}</option>)}
    </select>
);

const NumberInput = ({ label, value, setValue }) => (
    <input type="number" placeholder={label} value={value} onChange={(e) => setValue(e.target.value)} className="w-full bg-slate-900/50 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
);

const DateSelector = ({ label, value, setValue }) => (
    <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">{label}</label>
        <input type="date" value={value.format('YYYY-MM-DD')} onChange={(e) => setValue(dayjs(e.target.value))} className="w-full bg-slate-900/50 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
    </div>
);

const PlantCreate = () => {
    const navigate = useNavigate();
    const { systems, isLoading, error, createPlant } = usePlants();
    const { species } = useSpecies();
    const { mixes } = useMixes(true);
    const { carePlans } = useCarePlans();

    const [selectedSpecies, setSelectedSpecies] = useState(null);
    const [system, setSystem] = useState(null);
    const [mix, setMix] = useState(null);
    const [carePlan, setCarePlan] = useState(null);
    const [size, setSize] = useState('');
    const [cost, setCost] = useState('');
    const [phase, setPhase] = useState(PHASE_LABELS.adult);
    const [description, setDescription] = useState('');
    const [showSpeciesCreate, setShowSpeciesCreate] = useState(false);
    const [formError, setFormError] = useState('');
    
    // New date fields
    const [potted_on, setPottedOn] = useState(dayjs());
    const [watered_on, setWateredOn] = useState(dayjs());
    const [fertilized_on, setFertilizedOn] = useState(dayjs());
    const [cleansed_on, setCleansedOn] = useState(dayjs());

    const handleSpeciesCreated = (newSpecies) => {
        setSelectedSpecies(newSpecies);
        setShowSpeciesCreate(false);
    };

    const handleSpeciesCreateClose = () => {
        setShowSpeciesCreate(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError(''); // Reset error on new submission

        if (!selectedSpecies || !system) {
            setFormError('Please select a Species and a System.');
            return;
        }

        const newPlant = {
            size: parseInt(size, 10) || 0,
            cost: parseFloat(cost) || 0,
            description: description || '',
            species_id: selectedSpecies ? selectedSpecies.id : null,
            system_id: system.id,
            mix_id: mix ? mix.id: null,
            care_plan_id: carePlan ? carePlan.id : null,
            phase,
            potted_on: potted_on.toISOString(),
            watered_on: watered_on.toISOString(),
            fertilized_on: fertilized_on.toISOString(),
            cleansed_on: cleansed_on.toISOString(),
        };

        try {
            await createPlant(newPlant);
            navigate("/"); // Navigate to home on success
        } catch (error) {
            console.error('Error adding new plant:', error);
            setFormError('Failed to create plant. Please try again.');
        }
    };

    const handleCancel = () => navigate(-1);


    return (
        <div className="p-4 h-full flex items-center justify-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`w-full max-w-4xl grid grid-cols-1 md:grid-cols-5 gap-8 transition-all duration-300`}>
                {/* --- MAIN FORM CARD --- */}
                <form onSubmit={handleSubmit} className={`bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl shadow-black/20 flex flex-col gap-6 ${showSpeciesCreate ? 'md:col-span-3' : 'md:col-span-5'}`}>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center">
                            <Leaf size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-slate-100">New Bubby Alert!</h2>
                            <p className="text-sm text-slate-400">Add a new plant to your collection.</p>
                        </div>
                    </div>
                    
                    <div className="relative">
                        <AutoCompleteInput label="Species" value={selectedSpecies} setValue={setSelectedSpecies} options={species} />
                        <button type="button" onClick={() => setShowSpeciesCreate(true)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-emerald-400 rounded-full hover:bg-slate-700/50 transition-colors">
                            <Plus size={16} />
                        </button>
                    </div>
                    
                    <AutoCompleteInput label="System" value={system} setValue={setSystem} options={systems} />
                    <AutoCompleteInput label="Mix" value={mix} setValue={setMix} options={mixes} />
                    <AutoCompleteInput label="Care Plan" value={carePlan} setValue={setCarePlan} options={carePlans} />
                    <DropdownInput label="Phase" value={phase} options={Object.values(PHASE_LABELS)} setValue={setPhase} />

                    <div className="grid grid-cols-2 gap-4">
                        <NumberInput label="Size" value={size} setValue={setSize} />
                        <NumberInput label="Cost" value={cost} setValue={setCost} />
                    </div>

                    <textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="w-full bg-slate-900/50 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none" />

                    <div className="grid grid-cols-2 gap-4">
                        <DateSelector label="Potted On" value={potted_on} setValue={setPottedOn} />
                        <DateSelector label="Watered On" value={watered_on} setValue={setWateredOn} />
                        <DateSelector label="Fertilized On" value={fertilized_on} setValue={setFertilizedOn} />
                        <DateSelector label="Cleansed On" value={cleansed_on} setValue={setCleansedOn} />
                    </div>

                    {formError && <p className="text-sm text-red-400 text-center">{formError}</p>}

                    <div className="flex justify-end gap-3 pt-4 mt-auto">
                        <button type="button" onClick={handleCancel} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800/60 transition-colors">Cancel</button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed">
                            {isLoading ? 'Saving...' : 'Add Plant'}
                        </button>
                    </div>
                </form>

                {/* --- SPECIES CREATE CARD (Conditional) --- */}
                {showSpeciesCreate && (
                    <div className="md:col-span-2">
                        <SpeciesCreateCard
                            onClose={handleSpeciesCreateClose}
                            onSpeciesCreated={handleSpeciesCreated}
                        />
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default PlantCreate;