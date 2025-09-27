import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Droplet, Sun, Thermometer, Wind, Plus, Send, Leaf, Calendar as CalendarIcon, DollarSign, Settings, LayoutGrid, Package, ShieldCheck, ListTodo, ClipboardList, Layers, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Calendar from './pages/calendar/Calendar';

import Systems from './pages/system/Systems.js';
import BudgetPage from './pages/budget/Budget.js';
import GoalCreate from './pages/goals/GoalCreate.js';
// --- HELPER FUNCTIONS ---
const getCurrentDate = () => {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('en-US', options);
};

// --- BACKGROUND COMPONENTS ---
export const BackgroundAnimations = React.memo(() => (
    <div className="fixed inset-0 -z-10">
        <div className="fixed top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_20%_50%,rgba(52,211,153,0.1)_0%,transparent_40%),radial-gradient(circle_at_80%_80%,rgba(110,231,183,0.08)_0%,transparent_40%),radial-gradient(circle_at_40%_20%,rgba(16,185,129,0.09)_0%,transparent_40%),radial-gradient(circle_at_80%_10%,rgba(167,243,208,0.08)_0%,transparent_40%)] animate-[gradientShift_25s_ease_infinite] filter blur-3xl -z-10" />
        <ul className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 m-0 p-0">
            {[...Array(10)].map((_, i) => {
                const size = Math.random() * 130 + 20;
                const delay = Math.random() * 10;
                const duration = Math.random() * 20 + 10;
                const left = `${Math.random() * 90}%`;
                return (
                    <li key={i} className="absolute bottom-[-150px] list-none block bg-slate-800/10 border border-slate-700/20 animate-[rise_25s_infinite_linear] rounded-lg" style={{ width: `${size}px`, height: `${size}px`, animationDelay: `${delay}s`, animationDuration: `${duration}s`, left: left }} />
                );
            })}
        </ul>
    </div>
));

// --- SHARED UI COMPONENTS ---
const Header = () => (
  <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 mb-8 shadow-2xl shadow-black/20">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">Good morning tush</h1>
        <p className="text-sm font-medium text-slate-400">{getCurrentDate()}</p>
      </div>
      <div className="w-14 h-14 relative">
        <div className="absolute w-full h-full border-2 border-transparent border-t-emerald-500 rounded-full animate-[rotate_4s_linear_infinite]" />
        <div className="absolute w-3/4 h-3/4 top-[12.5%] left-[12.5%] border-2 border-transparent border-t-emerald-400 opacity-70 rounded-full animate-[rotate_3s_linear_infinite_reverse]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">🌿</div>
      </div>
    </div>
  </div>
);

const StatCard = ({ icon, color, metric, label, delay }) => {
    const iconStyles = {
        plants: { bg: 'bg-emerald-500/10', stroke: 'text-emerald-500' },
        tasks: { bg: 'bg-blue-500/10', stroke: 'text-blue-500' },
        care: { bg: 'bg-red-500/10', stroke: 'text-red-500' },
        budget: { bg: 'bg-amber-500/10', stroke: 'text-amber-500' },
    };
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: delay * 0.1 }}>
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 flex items-center gap-4 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30">
                <div className={`w-11 h-11 flex items-center justify-center rounded-xl flex-shrink-0 ${iconStyles[color].bg}`}>
                    {React.cloneElement(icon, { size: 22, className: iconStyles[color].stroke })}
                </div>
                <div>
                    <p className="text-2xl font-semibold text-slate-100">{metric}</p>
                    <p className="text-xs font-medium text-slate-400">{label}</p>
                </div>
            </div>
        </motion.div>
    );
};

const PlantCard = ({ name, species, status }) => (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 mb-4 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30">
        <div className="flex justify-between items-start mb-6">
            <div>
                <h3 className="text-lg font-semibold text-slate-100">{name}</h3>
                <p className="text-sm text-slate-400 italic">{species}</p>
            </div>
            <div className="flex items-center gap-2 py-1 px-3 bg-emerald-500/10 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]" />
                <p className="text-xs font-medium text-emerald-500">{status}</p>
            </div>
        </div>
        <div className="grid grid-cols-4 gap-4 text-center">
            {[{ icon: <Droplet size={22} />, value: '2 days', color: 'text-sky-500' }, { icon: <Sun size={22} />, value: 'Bright', color: 'text-amber-500' }, { icon: <Thermometer size={22} />, value: '22°C', color: 'text-red-500' }, { icon: <Wind size={22} />, value: '65%', color: 'text-cyan-500' }].map((metric) => (
                <div key={metric.value}><div className={`mx-auto ${metric.color}`}>{metric.icon}</div><p className="text-sm font-medium text-slate-400 mt-1">{metric.value}</p></div>
            ))}
        </div>
    </div>
);

// --- PAGE COMPONENTS (PLACEHOLDERS) ---
const DashboardPage = () => (
    <div className="p-4 h-full flex flex-col">
        <div className="grid grid-cols-2 gap-4 mb-8">
            <StatCard icon={<Leaf />} color="plants" metric="24" label="Total Plants" delay={1} />
            <StatCard icon={<ListTodo />} color="tasks" metric="5" label="Tasks Today" delay={2} />
            <StatCard icon={<ShieldCheck />} color="care" metric="3" label="Need Care" delay={3} />
            <StatCard icon={<DollarSign />} color="budget" metric="$120" label="Remaining Budget" delay={4} />
        </div>
        <div>
            <h2 className="text-lg font-semibold text-slate-400 mb-4 px-2">Living Collection</h2>
            <PlantCard name="Monstera Deliciosa" species="Swiss Cheese Plant" status="Thriving" />
            <PlantCard name="Ficus Lyrata" species="Fiddle Leaf Fig" status="Excellent" />
        </div>
    </div>
);
const PagePlaceholder = ({ title }) => <div className="p-8"><h1 className="text-4xl font-bold text-slate-100">{title}</h1></div>;

// --- NAVIGATION / LAYOUT ---
const AppLayout = () => {
  const [showCreateOptions, setShowCreateOptions] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const navRef = useRef(null);
  const footerRef = useRef(null);
  const location = useLocation();
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const navItems = [
    { to: "/", icon: <Leaf /> }, { to: "/calendar", icon: <CalendarIcon /> }, { to: "/budget", icon: <DollarSign /> },
    { to: "/systems", icon: <LayoutGrid /> }, { to: "/inventory", icon: <Package /> }, { to: "/settings", icon: <Settings /> }
  ];

  const isWidePage = ['/calendar', '/budget', '/systems', '/goals/create'].includes(location.pathname);

  useEffect(() => {
    const activeLink = navRef.current?.querySelector('a.active');
    if (activeLink) {
        const { offsetLeft, clientWidth } = activeLink;
        setIndicatorStyle({ left: offsetLeft, width: clientWidth, opacity: 1 });
    }
  }, [location]);

  const createOptions = [
    { icon: <Leaf />, label: 'Plant', path: '/plants/create' },
    { icon: <Layers />, label: 'Mix', path: '/mixes/create' },
    { icon: <ShieldCheck />, label: 'System', path: '/systems/create' },
    { icon: <ListTodo />, label: 'Todo', path: '/todos/create' },
    { icon: <ClipboardList />, label: 'Care Plan', path: '/care-plans/create' },
    { icon: <Flag />, label: 'Goal', path: '/goals/create' }
  ];

  return (
    <div className="h-screen grid grid-rows-[auto_1fr_auto]">
      <div className={`${isWidePage ? 'max-w-4xl' : 'max-w-md'} mx-auto px-4 pt-4 w-full`}>
          <Header />
      </div>
      <main className={`mx-auto w-full overflow-y-auto ${isWidePage ? 'max-w-4xl' : 'max-w-md'}`}>
          <Outlet />
      </main>
      <footer ref={footerRef} className="relative w-[calc(100%-2rem)] max-w-md mx-auto mb-4 z-10">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-3 shadow-2xl shadow-black/30 flex flex-col gap-3">
          <AnimatePresence>
            {showCreateOptions && (
              <motion.div initial={{ opacity: 0, y: 10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: 10, height: 0 }} className="flex justify-center gap-4 overflow-hidden">
                {createOptions.map((item) => (
                  <NavLink to={item.path} key={item.label} className="text-center cursor-pointer group no-underline">
                    <>
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-900/70 shadow-lg group-hover:-translate-y-1 transition-transform duration-200">
                        {React.cloneElement(item.icon, { size: 22, className: "text-emerald-500" })}
                      </div>
                      <p className="text-xs text-slate-400 font-medium mt-2">{item.label}</p>
                    </>
                  </NavLink>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <form className="w-full relative h-12" onSubmit={(e) => { e.preventDefault(); console.log('Submit:', chatMessage); setChatMessage(''); }}>
            <input type="text" placeholder="Ask Flora anything..." value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} className="w-full h-full bg-slate-900/50 rounded-full border-none pl-5 pr-14 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
            <AnimatePresence>
              {chatMessage.trim().length > 0 && (
                <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} type="submit" className="absolute right-1.5 top-1.5 w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-green-400 transition-all duration-300 transform hover:scale-110">
                  <Send size={18}/>
                </motion.button>
              )}
            </AnimatePresence>
          </form>
          <div ref={navRef} className="w-full h-14 bg-slate-900/50 rounded-full flex justify-around items-center relative">
            <motion.div className="absolute h-12 bg-slate-900 rounded-full shadow-md z-0" animate={indicatorStyle} transition={{ type: "spring", stiffness: 400, damping: 30 }} />
            {[...navItems.slice(0, 3), { isFab: true }, ...navItems.slice(3, 6)].map((item, index) => {
              if (item.isFab) {
                return (
                  <button key="fab" className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 z-10 -translate-y-1" onClick={() => setShowCreateOptions(!showCreateOptions)}>
                    <motion.div animate={{ rotate: showCreateOptions ? 45 : 0 }}><Plus /></motion.div>
                  </button>
                );
              }
              return (
                <NavLink key={item.to} to={item.to} end className={({ isActive }) => `w-12 h-12 flex items-center justify-center z-10 transition-colors ${isActive ? 'text-emerald-500' : 'text-slate-500'}`}>
                  {item.icon}
                </NavLink>
              );
            })}
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="budget" element={<BudgetPage />} />
        <Route path="systems" element={<Systems />} />
        <Route path="goals/create" element={<GoalCreate />} />
        <Route path="inventory" element={<PagePlaceholder title="Inventory" />} />
        <Route path="settings" element={<PagePlaceholder title="Settings" />} />
      </Route>
    </Routes>
  );
}
