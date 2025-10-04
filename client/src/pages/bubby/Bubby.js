import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { ShieldCheck, ClipboardList, Layers } from 'lucide-react';

const Bubby = () => {
    const navItems = [
        { to: 'systems', label: 'Systems', icon: <ShieldCheck size={16} /> },
        { to: 'care-plans', label: 'Care Plans', icon: <ClipboardList size={16} /> },
        { to: 'mixes', label: 'Mixes', icon: <Layers size={16} /> },
    ];

    return (
        <div className="p-4 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6">
                {navItems.map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${
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
            <div className="flex-grow min-h-0"><Outlet /></div>
        </div>
    );
};

export default Bubby;
