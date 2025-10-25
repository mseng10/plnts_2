import React from 'react';
import { useNavigate, useParams, Outlet } from 'react-router-dom';
import { useSystems } from '../../hooks/useSystems';
import { useLights } from '../../hooks/useLights';
import { ShieldCheck } from 'lucide-react';
import SystemCard from './SystemCard';

const Systems = () => {
  const { id } = useParams();

  if (id) {
    return (
        <div className="grid grid-cols-2 gap-8 items-start h-full">
            <div className="overflow-y-auto h-full pr-4 -mr-4 scrollbar-hide"><SystemsList /></div>
            <Outlet />
        </div>
    );
  }
  return (
    <div className="h-full overflow-y-auto scrollbar-hide"><SystemsList /></div>
  );
};

const SystemsList = () => {
  const { id } = useParams();
  const { systems, isLoading, error, deprecateSystem } = useSystems();
  const { lights } = useLights();

  if (isLoading) return <div className="p-4 text-slate-400 text-center">Loading systems...</div>;
  if (error) return <div className="p-4 text-red-400 text-center">Error loading systems.</div>;
  if (systems.length === 0) {
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center text-center">
        <ShieldCheck size={48} className="text-slate-600 mb-4" />
        <h2 className="text-xl font-semibold text-slate-300">No Systems Found</h2>
        <p className="text-slate-500 mt-1">Create your first automated system to get started.</p>
      </div>
    );
  }

  return (
    <div className={`p-4 grid ${id ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-6`}>
      {systems.map((system) => (
        <SystemCard 
          key={system.id} 
          system={system} 
          lights={lights.filter(light => light.system_id === system.id)} 
          deprecateSystem={deprecateSystem}
        />
      ))}
    </div>
  );
}

export default Systems;