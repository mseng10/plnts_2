import React, { Fragment } from 'react';
import { useNavigate, useParams, Outlet } from 'react-router-dom';
import { useSystems, useLights } from '../../hooks/useSystems';
import { Thermometer, Droplet, Sun, Edit, AlertTriangle, Leaf, Trash2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

const SystemCard = ({ system, lights, deprecateSystem }) => {
  const navigate = useNavigate();

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete the "${system.name}" system?`)) {
      deprecateSystem(system.id);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-3">
            <ShieldCheck size={20} className="text-green-400 flex-shrink-0" />
            <h3 className="text-lg font-semibold text-slate-100 truncate">{system.name}</h3>
          </div>
          <p className="text-sm text-slate-400">Created: {dayjs(system.created_on).format('MMM D, YYYY')}</p>
        </div>
        <div className="flex items-center gap-2 py-1 px-3 bg-emerald-500/10 rounded-full">
          <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]" />
          <p className="text-xs font-medium text-emerald-500">Online</p>
        </div>
      </div>

      <div className="flex justify-around items-center my-4 text-center">
        <div>
          <Droplet size={22} className="text-sky-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-slate-100">{system.target_humidity}<span className="text-sm font-medium text-slate-400">%</span></p>
        </div>
        <div>
          <Thermometer size={22} className="text-red-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-slate-100">{system.target_temperature}<span className="text-sm font-medium text-slate-400">°F</span></p>
        </div>
        <div>
          <Sun size={22} className="text-amber-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-slate-100">
            {system.duration}<span className="text-sm font-medium text-slate-400">h</span>
            <span className="text-xs text-slate-500 mx-1">/</span>
            {system.distance}<span className="text-sm font-medium text-slate-400">"</span>
          </p>
        </div>
      </div>


      <div className="mt-4">
        <h4 className="text-sm font-semibold text-slate-400 mb-2">Lights</h4>
        <div className="flex items-center gap-2">
          {lights && lights.map((light) => (
            <div key={light.id} className="w-6 h-6 rounded-full bg-amber-500" title={light.name} />
          ))}
        </div>
      </div>

      <div className="border-t border-slate-700/50 mt-6 pt-4 flex justify-end items-center gap-2">
        <button className="p-2 rounded-full text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 transition-colors"><Leaf size={16} /></button>
        <button className="p-2 rounded-full text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 transition-colors"><AlertTriangle size={16} /></button>
        <button onClick={() => navigate(`/bubbys/systems/${system.id}`)} className="p-2 rounded-full text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 transition-colors"><Edit size={16} /></button>
        <button onClick={handleDelete} className="p-2 rounded-full text-slate-400 hover:bg-slate-700/50 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
      </div>
    </motion.div>
  );
};

const Systems = () => {
  const { id } = useParams();

  if (id) {
    return (
        <div className="grid grid-cols-2 gap-8 items-start" style={{height: 'calc(100vh - 230px)'}}>
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