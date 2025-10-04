import React from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { useCarePlans } from '../../hooks/useCarePlans';
import CarePlanCard from './CarePlanCard';
import { ClipboardList } from 'lucide-react';

const CarePlans = () => {
    const { carePlans, isLoading, error, deprecateCarePlan } = useCarePlans();
    const { id } = useParams();

    if (isLoading) return <div className="p-4 text-slate-400 text-center">Loading care plans...</div>;
    if (error) return <div className="p-4 text-red-400 text-center">Error loading care plans.</div>;

    const gridCols = id ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2';

    if (id) {
        return (
            <div className="grid grid-cols-2 gap-8 items-start" style={{height: 'calc(100vh - 230px)'}}>
                <div className="overflow-y-auto h-full pr-4 -mr-4 scrollbar-hide"><CarePlansList /></div>
                <Outlet />
            </div>
        );
    }

    if (carePlans.length === 0) {
        return (
            <div className="p-4 h-full flex flex-col items-center justify-center text-center">
                <ClipboardList size={48} className="text-slate-600 mb-4" />
                <h2 className="text-xl font-semibold text-slate-300">No Care Plans Found</h2>
                <p className="text-slate-500 mt-1">Create your first care plan to get started.</p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto scrollbar-hide">
            <CarePlansList />
        </div>
    );
};

const CarePlansList = () => {
    const { carePlans, deprecateCarePlan } = useCarePlans();
    const { id } = useParams();
    const gridCols = id ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2';

    return(
        <div className={`p-4 grid ${gridCols} gap-6`}>
            {carePlans.map((plan) => (
                <CarePlanCard key={plan.id} carePlan={plan} deprecateCarePlan={deprecateCarePlan} />
            ))}
        </div>
    )
}

export default CarePlans;