import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { ShieldCheck, ClipboardList, Layers, Leaf } from 'lucide-react';

const Bubby = () => {
    const navItems = [
        { to: 'systems', label: 'Systems', icon: <ShieldCheck size={16} /> },
        { to: 'care-plans', label: 'Care Plans', icon: <ClipboardList size={16} /> },
        { to: 'mixes', label: 'Mixes', icon: <Layers size={16} /> },
        { to: 'plants', label: 'Plants', icon: <Leaf size={16} /> },
    ];

    return (
        <div className="p-4 h-full flex flex-col">
            <div className="flex items-center justify-center gap-2 mb-4">
                {navItems.map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center gap-2 py-2 px-4 rounded-full text-sm font-semibold transition-colors ${
                                isActive
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : 'text-slate-400 hover:bg-slate-800/60'
                            }`
                        }
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </div>
            <div className="flex-grow min-h-0 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl shadow-black/20">
                <Outlet />
            </div>
        </div>
    );
};

export default Bubby;
