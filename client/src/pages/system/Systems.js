import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSystems, useLights } from '../../hooks/useSystems';
import { Thermometer, Droplet, Sun, Edit, AlertTriangle, Leaf, Trash2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

const CircularStat = ({ value, icon, colorClass }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative w-24 h-24 flex flex-col items-center justify-center">
      <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 80 80">
        <circle className="text-slate-700/50" strokeWidth="6" stroke="currentColor" fill="transparent" r={radius} cx="40" cy="40" />
        <circle
          className={colorClass}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="40"
          cy="40"
        />
      </svg>
      <div className={`absolute ${colorClass}`}>{icon}</div>
      <span className="absolute bottom-1 text-xs font-medium text-slate-400">{value}%</span>
    </div>
  );
};

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
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{system.name}</h3>
          <p className="text-sm text-slate-400">Created: {dayjs(system.created_on).format('MMM D, YYYY')}</p>
        </div>
        <div className="flex items-center gap-2 py-1 px-3 bg-emerald-500/10 rounded-full">
          <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]" />
          <p className="text-xs font-medium text-emerald-500">Online</p>
        </div>
      </div>

      <div className="flex justify-around items-center my-4">
        <CircularStat value={system.humidity} icon={<Droplet size={24} />} colorClass="text-sky-500" />
        <CircularStat value={system.temperature} icon={<Thermometer size={24} />} colorClass="text-red-500" />
        <CircularStat value={system.light} icon={<Sun size={24} />} colorClass="text-amber-500" />
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-semibold text-slate-400 mb-2">Lights</h4>
        <ul className="space-y-2">
          {lights && lights.map((light) => (
            <li key={light.id} className="text-sm text-slate-300 bg-slate-900/50 px-3 py-1.5 rounded-md flex items-center gap-2">
              <Sun size={14} className="text-amber-500" /> {light.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-slate-700/50 mt-6 pt-4 flex justify-end items-center gap-2">
        <button className="p-2 rounded-full text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 transition-colors"><Leaf size={16} /></button>
        <button className="p-2 rounded-full text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 transition-colors"><AlertTriangle size={16} /></button>
        <button onClick={() => navigate(`/systems/${system.id}`)} className="p-2 rounded-full text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 transition-colors"><Edit size={16} /></button>
        <button onClick={handleDelete} className="p-2 rounded-full text-slate-400 hover:bg-slate-700/50 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
      </div>
    </motion.div>
  );
};

const Systems = () => {
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
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
};

export default Systems;