import React from 'react';
import { useCarePlans } from '../../hooks/useCarePlans';
import CarePlanCard from './CarePlanCard';
import { ClipboardList } from 'lucide-react';

const CarePlans = () => {
    const { carePlans, isLoading, error, deprecateCarePlan } = useCarePlans();

    if (isLoading) return <div className="p-4 text-slate-400 text-center">Loading care plans...</div>;
    if (error) return <div className="p-4 text-red-400 text-center">Error loading care plans.</div>;

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
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {carePlans.map((plan) => (
                <CarePlanCard key={plan.id} carePlan={plan} deprecateCarePlan={deprecateCarePlan} />
            ))}
        </div>
    );
};

export default CarePlans;