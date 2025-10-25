import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { usePlants } from '../../hooks/usePlants';
import { PHASE_LABELS } from '../../constants';
import { Leaf } from 'lucide-react';
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

const PlantUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { plants, systems, mixes, carePlans, species, isLoading, error, updatePlant } = usePlants();

    const [currentPlant, setCurrentPlant] = useState(null);
    const [formError, setFormError] = useState('');

    // Form fields
    const [selectedSpecies, setSelectedSpecies] = useState(null);
    const [system, setSystem] = useState(null);
    const [mix, setMix] = useState(null);
    const [carePlan, setCarePlan] = useState(null);
    const [size, setSize] = useState('');
    const [cost, setCost] = useState('');
    const [phase, setPhase] = useState(PHASE_LABELS.adult);
    const [description, setDescription] = useState('');
    const [potted_on, setPottedOn] = useState(dayjs());
    const [watered_on, setWateredOn] = useState(dayjs());
    const [fertilized_on, setFertilizedOn] = useState(dayjs());
    const [cleansed_on, setCleansedOn] = useState(dayjs());

    useEffect(() => {
        if (plants.length > 0) {
            const plantToUpdate = plants.find(p => String(p.id) === id);
            if (plantToUpdate) {
                setCurrentPlant(plantToUpdate);
                setSelectedSpecies(plantToUpdate.species || null);
                setSystem(plantToUpdate.system || null);
                setMix(plantToUpdate.mix || null);
                setCarePlan(plantToUpdate.carePlan || null);
                setSize(plantToUpdate.size || '');
                setCost(plantToUpdate.cost || '');
                setPhase(plantToUpdate.phase || PHASE_LABELS.adult);
                setDescription(plantToUpdate.description || '');
                setPottedOn(dayjs(plantToUpdate.potted_on));
                setWateredOn(dayjs(plantToUpdate.watered_on));
                setFertilizedOn(dayjs(plantToUpdate.fertilized_on));
                setCleansedOn(dayjs(plantToUpdate.cleansed_on));
            } else {
                navigate('/404');
            }
        }
    }, [id, plants, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError('');

        if (!system) {
            setFormError('Please select a System.');
            return;
        }

        const updatedPlantData = {
            id,
            size: parseInt(size, 10) || 0,
            cost: parseFloat(cost) || 0,
            description: description || '',
            species_id: selectedSpecies ? selectedSpecies.id : null,
            system_id: system.id,
            mix_id: mix ? mix.id : null,
            care_plan_id: carePlan ? carePlan.id : null,
            phase,
            potted_on: potted_on.toISOString(),
            watered_on: watered_on.toISOString(),
            fertilized_on: fertilized_on.toISOString(),
            cleansed_on: cleansed_on.toISOString(),
        };

        try {
            await updatePlant(updatedPlantData);
            navigate("/");
        } catch (error) {
            console.error('Error updating plant:', error);
            setFormError('Failed to update plant. Please try again.');
        }
    };

    const handleCancel = () => navigate(-1);

    if (isLoading || !currentPlant) return <div className="p-4 text-slate-400 text-center">Loading plant details...</div>;
    if (error) return <div className="p-4 text-red-400 text-center">{error}</div>;

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl shadow-black/20 flex flex-col gap-6"
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 h-full">
                <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center">
                        <Leaf size={28} />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-slate-100">Edit Bubby</h2>
                        <p className="text-sm text-slate-400">Update details for {currentPlant.species.name}.</p>
                    </div>
                </div>
                
                <div className="flex-grow space-y-6 overflow-y-auto pr-4 -mr-4">
                    <div className="grid grid-cols-2 gap-4">
                        <AutoCompleteInput label="Species" value={selectedSpecies} setValue={setSelectedSpecies} options={species} />
                        <AutoCompleteInput label="System" value={system} setValue={setSystem} options={systems} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <AutoCompleteInput label="Mix" value={mix} setValue={setMix} options={mixes} />
                        <AutoCompleteInput label="Care Plan" value={carePlan} setValue={setCarePlan} options={carePlans} />
                    </div>
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
                </div>

                {formError && <p className="text-sm text-red-400 text-center flex-shrink-0">{formError}</p>}

                <div className="flex justify-end gap-3 pt-4 mt-auto flex-shrink-0">
                    <button type="button" onClick={handleCancel} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800/60 transition-colors">Cancel</button>
                    <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed">
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default PlantUpdate;