import React, { useState, useMemo } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { usePlants } from '../../hooks/usePlants';
import PlantCard from './PlantCard';
import { Leaf, Droplet, Replace, SprayCan, Search, XCircle, CheckCircle } from 'lucide-react';
import dayjs from 'dayjs';

const Plants = () => {
    const { id } = useParams();

    if (id) {
        return (
            <div className="grid grid-cols-2 gap-8 items-start h-full">
                <div className="h-full overflow-y-auto scrollbar-hide">
                    <PlantsList />
                </div>
                <Outlet />
            </div>
        );
    }
    return <PlantsList />;
};

const QuickFilterButton = ({ icon, onClick, isActive, activeClasses }) => (
    <button
        onClick={onClick}
        className={`p-2.5 rounded-full transition-all duration-300 bg-slate-800/50 text-slate-400 hover:bg-slate-700/80 hover:text-white ${isActive ? activeClasses : ''}`}
    >
        {icon}
    </button>
);

const SearchBar = ({ searchTerm, setSearchTerm, placeholder }) => {
    return (
        <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
                type="text"
                placeholder={placeholder || "Search..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/70 rounded-full border border-slate-700/50 pl-11 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
        </div>
    );
};


const PlantsList = () => {
    const [activeFilters, setActiveFilters] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { plants, isLoading, error, deprecatePlant, updatePlant } = usePlants();
    const { id } = useParams();

    const getOverdueTasks = (plant) => {
        if (!plant.carePlan) return [];
        const overdue = [];
        const today = dayjs();
        const { watering, cleaning, potting } = plant.carePlan;

        if (watering && today.diff(dayjs(plant.watered_on), 'day') > watering) overdue.push('water');
        if (cleaning && today.diff(dayjs(plant.cleansed_on), 'day') > cleaning) overdue.push('cleanse');
        if (potting && today.diff(dayjs(plant.potted_on), 'day') > potting) overdue.push('repot');

        return overdue;
    };

    const filteredPlants = useMemo(() => {
        let filtered = [...plants];

        // Apply quick filters
        if (activeFilters.length > 0) {
            filtered = filtered.filter(plant => {
                const overdue = getOverdueTasks(plant);
                return activeFilters.every(filter => overdue.includes(filter));
            });
        }

        // Apply search term
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(plant =>
                (plant.species && plant.species.name.toLowerCase().includes(lowerSearchTerm)) ||
                (plant.system && plant.system.name.toLowerCase().includes(lowerSearchTerm)) ||
                (plant.mix && plant.mix.name.toLowerCase().includes(lowerSearchTerm)) ||
                (plant.carePlan && plant.carePlan.name.toLowerCase().includes(lowerSearchTerm))
            );
        }

        return filtered;
    }, [plants, searchTerm, activeFilters]);

    const handleFilterClick = (filter) => {
        setActiveFilters(prev =>
            prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
        );
    };

    const handleClear = () => {
        setActiveFilters([]);
        setSearchTerm('');
    };

    const handleBulkUpdate = async () => {
        const today = dayjs().toISOString();
        const updates = {};

        if (activeFilters.includes('water')) updates.watered_on = today;
        if (activeFilters.includes('cleanse')) updates.cleansed_on = today;
        if (activeFilters.includes('repot')) updates.potted_on = today;

        if (Object.keys(updates).length === 0) return;

        // As requested, this just logs the action for now.
        // The actual update logic can be implemented later.
        console.log(`Would update ${filteredPlants.length} plants with:`, updates);
        alert(`Updating ${filteredPlants.length} plants for: ${activeFilters.join(', ')}`);
    };

    if (isLoading) return <div className="p-4 text-slate-400 text-center">Loading plants...</div>;
    if (error) return <div className="p-4 text-red-400 text-center">Error loading plants.</div>;

    if (plants.length === 0) {
        return (
            <div className="p-4 h-full flex flex-col items-center justify-center text-center">
                <Leaf size={48} className="text-slate-600 mb-4" />
                <h2 className="text-xl font-semibold text-slate-300">No Plants Found</h2>
                <p className="text-slate-500 mt-1">Create your first plant to get started.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-shrink-0 p-4 sticky top-0 z-10">
                <div className="flex items-center justify-between gap-2 w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-full p-2">
                    <div className="flex-grow max-w-xs">
                        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search plants..." />
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {activeFilters.length > 0 && (
                            <button onClick={handleBulkUpdate} className="p-2.5 text-slate-400 hover:text-emerald-400 transition-colors rounded-full hover:bg-emerald-500/10">
                                <CheckCircle size={18} />
                            </button>
                        )}
                        <QuickFilterButton
                            icon={<Droplet size={18} />}
                            onClick={() => handleFilterClick('water')}
                            isActive={activeFilters.includes('water')}
                            activeClasses="text-sky-400 bg-sky-500/10 shadow-[0_0_15px_0] shadow-sky-500/50"
                        />
                        <QuickFilterButton
                            icon={<Replace size={18} />}
                            onClick={() => handleFilterClick('repot')}
                            isActive={activeFilters.includes('repot')}
                            activeClasses="text-amber-400 bg-amber-500/10 shadow-[0_0_15px_0] shadow-amber-500/50"
                        />
                        <QuickFilterButton
                            icon={<SprayCan size={18} />}
                            onClick={() => handleFilterClick('cleanse')}
                            isActive={activeFilters.includes('cleanse')}
                            activeClasses="text-purple-400 bg-purple-500/10 shadow-[0_0_15px_0] shadow-purple-500/50"
                        />
                        <div className="w-px h-6 bg-slate-700/50 mx-1"></div>
                        <div className="w-10 h-10 flex items-center justify-center">
                            {(activeFilters.length > 0 || searchTerm) && (
                                <button onClick={handleClear} className="p-2.5 text-slate-500 hover:text-red-400 transition-colors rounded-full hover:bg-red-500/10"><XCircle size={18} /></button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className={`flex-grow p-4 grid ${id ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-6 overflow-y-auto scrollbar-hide`}>
                {filteredPlants.map((plant) => (
                    <PlantCard key={plant.id} plant={plant} deprecatePlant={deprecatePlant} />
                ))}
            </div>
        </div>
    );
}

export default Plants;