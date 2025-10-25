import React from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { useMixes, useSoils } from '../../hooks/useMix';
import MixCard from './MixCard';
import { Layers } from 'lucide-react';

const Mixes = () => {
    const { id } = useParams();

    if (id) {
        return (
            <div className="grid grid-cols-2 gap-8 items-start h-full">
                <div className="overflow-y-auto h-full pr-4 -mr-4 scrollbar-hide"><MixesList /></div>
                <Outlet />
            </div>
        );
    }
    return <div className="h-full overflow-y-auto scrollbar-hide"><MixesList /></div>;
};

const MixesList = () => {
    const { id } = useParams();
    const { mixes, isLoading, error, deleteMix } = useMixes();
    const { soils, isLoading: soilsLoading, error: soilsError } = useSoils();
    if (isLoading || soilsLoading) return <div className="p-4 text-slate-400 text-center">Loading mixes...</div>;
    if (error || soilsError) return <div className="p-4 text-red-400 text-center">Error loading mixes.</div>;
    if (mixes.length === 0) {
        return (
            <div className="p-4 h-full flex flex-col items-center justify-center text-center">
                <Layers size={48} className="text-slate-600 mb-4" />
                <h2 className="text-xl font-semibold text-slate-300">No Mixes Found</h2>
                <p className="text-slate-500 mt-1">Create your first soil mix to get started.</p>
            </div>
        );
    }
    return (
        <div className={`p-4 grid ${
            id ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
        } gap-6`}>
            {mixes.map((mix) => (
                <MixCard key={mix.id} mix={mix} deleteMix={deleteMix} soils={soils} />
            ))}
        </div>
    );
}

export default Mixes;