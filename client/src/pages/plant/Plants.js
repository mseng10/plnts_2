import React from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { usePlants } from '../../hooks/usePlants';
import PlantCard from './PlantCard';
import { Leaf } from 'lucide-react';

const Plants = () => {
    const { id } = useParams();

    if (id) {
        return (
            <div className="grid grid-cols-2 gap-8 items-start h-full">
                <div className="overflow-y-auto h-full pr-4 -mr-4 scrollbar-hide"><PlantsList /></div>
                <Outlet />
            </div>
        );
    }
    return <div className="h-full overflow-y-auto scrollbar-hide"><PlantsList /></div>;
};

const PlantsList = () => {
    const { plants, isLoading, error, deprecatePlant } = usePlants();
    const { id } = useParams();

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
        <div className={`p-4 grid ${id ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-6`}>
            {plants.map((plant) => (
                <PlantCard key={plant.id} plant={plant} deprecatePlant={deprecatePlant} />
            ))}
        </div>
    );
}

export default Plants;