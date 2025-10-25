import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, NavLink, Outlet, useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { Home, Plus, Send, Leaf, Calendar as CalendarIcon, DollarSign, Settings, Package, ShieldCheck, ListTodo, ClipboardList, Layers, Flag, Sun, Cloud, CloudRain, CloudSnow, Wind, Thermometer, Bot, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Calendar from './pages/calendar/Calendar';

import Systems from './pages/system/Systems.js';
import Bubby from './pages/bubby/Bubby.js';
import Mixes from './pages/mix/Mixes.js';
import CarePlans from './pages/care_plan/CarePlans.js';
import Plants from './pages/plant/Plants.js';
import BudgetPage from './pages/budget/Budget.js';
import CarePlanUpdate from './pages/care_plan/CarePlanUpdate.js';
import MixUpdate from './pages/mix/MixUpdate.js';
import SystemUpdate from './pages/system/SystemUpdate.js';
import GoalCreate from './pages/goals/GoalCreate.js';
import CarePlanCreate from './pages/care_plan/CarePlanCreate.js';
import MixCreate from './pages/mix/MixCreate.js';
import TodoCreate from './pages/todo/TodoCreate.js';
import SystemCreate from './pages/system/SystemCreate.js';
import PlantCreate from './pages/plant/PlantCreate.js';
import PlantUpdate from './pages/plant/PlantUpdate.js';
import { useMeta } from './hooks/useMeta.js';
import { APIS, apiBuilder, simpleFetch, simplePost } from './api.js';

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

const Weather = () => {
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported.");
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            // Using Open-Meteo API - no API key required and works globally.
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude.toFixed(2)}&longitude=${longitude.toFixed(2)}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`;

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error('Failed to fetch weather.');
                const data = await response.json();
                setWeather(data);
            } catch (e) {
                setError(e.message);
            }
        }, () => setError("Location access denied."));
    }, []);

    const getWeatherInfo = (weatherCode) => {
        // WMO Weather interpretation codes from Open-Meteo
        const codes = {
            0: { icon: <Sun size={20} className="text-amber-400" />, label: 'Clear sky' },
            1: { icon: <Sun size={20} className="text-amber-400" />, label: 'Mainly clear' },
            2: { icon: <Cloud size={20} className="text-slate-400" />, label: 'Partly cloudy' },
            3: { icon: <Cloud size={20} className="text-slate-400" />, label: 'Overcast' },
            45: { icon: <Cloud size={20} className="text-slate-400" />, label: 'Fog' },
            61: { icon: <CloudRain size={20} className="text-sky-400" />, label: 'Slight rain' },
            63: { icon: <CloudRain size={20} className="text-sky-400" />, label: 'Rain' },
            65: { icon: <CloudRain size={20} className="text-sky-400" />, label: 'Heavy rain' },
            80: { icon: <CloudRain size={20} className="text-sky-400" />, label: 'Slight showers' },
            81: { icon: <CloudRain size={20} className="text-sky-400" />, label: 'Rain showers' },
            82: { icon: <CloudRain size={20} className="text-sky-400" />, label: 'Violent showers' },
            95: { icon: <CloudRain size={20} className="text-sky-400" />, label: 'Thunderstorm' },
        };
        return codes[weatherCode] || { icon: <Thermometer size={20} className="text-slate-500" />, label: 'Weather' };
    };

    if (error) return <div className="text-xs text-red-400/80 font-medium">{error}</div>;
    if (!weather || !weather.current) {
        return (
            <div className="flex items-center gap-2 animate-pulse">
                <div className="w-5 h-5 rounded-full bg-slate-700/50" />
                <div className="w-10 h-4 rounded bg-slate-700/50" />
                <div className="w-24 h-3 rounded bg-slate-700/50" />
            </div>
        );
    }

    const { icon, label } = getWeatherInfo(weather.current.weather_code);

    return (
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
            {icon}
            <span>{Math.round(weather.current.temperature_2m)}°F</span>
            <span className="text-slate-500 font-medium text-xs truncate max-w-[150px]">{label}</span>
        </div>
    );
};

// --- SHARED UI COMPONENTS ---
const Header = () => {
  const [greeting, setGreeting] = useState("Loading...");

  useEffect(() => {
    const fetchGreeting = async () => {
      try {
        const url = apiBuilder(APIS.app.greeting).get();
        const data = await simpleFetch(url);
        setGreeting(data.message);
      } catch (error) {
        console.error("Failed to fetch greeting:", error);
        setGreeting("Good morning tush"); // Fallback message
      }
    };

    fetchGreeting();
  }, []);

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 mb-8 shadow-2xl shadow-black/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 relative flex-shrink-0">
            <div className="absolute w-full h-full border-2 border-transparent border-t-emerald-500 rounded-full animate-[rotate_4s_linear_infinite]" />
            <div className="absolute w-3/4 h-3/4 top-[12.5%] left-[12.5%] border-2 border-transparent border-t-emerald-400 opacity-70 rounded-full animate-[rotate_3s_linear_infinite_reverse]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">🌿</div>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-100">{greeting}</h1>
            <p className="text-sm font-medium text-slate-400 mt-1">{getCurrentDate()}</p>
          </div>
        </div>
        <div className="text-right">
          <Weather />
        </div>
      </div>
    </div>
  );
};

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

// --- PAGE COMPONENTS (PLACEHOLDERS) ---
const DashboardPage = () => {
    const { meta, isLoading, error } = useMeta();

    if (isLoading) return <div className="p-4 text-slate-400 text-center">Loading dashboard...</div>;
    if (error) return <div className="p-4 text-red-400 text-center">Could not load dashboard data.</div>;

    return (
        <div className="p-4 h-full flex flex-col">
            <div className="grid grid-cols-2 gap-4 mb-8">
                <StatCard icon={<Leaf />} color="plants" metric={meta?.total_plants ?? '...'} label="Total Plants" delay={1} />
                <StatCard icon={<ListTodo />} color="tasks" metric={meta?.task_count ?? '...'} label="Tasks Today" delay={2} />
                <StatCard icon={<ShieldCheck />} color="care" metric={meta?.alert_count ?? '...'} label="Need Care" delay={3} />
                <StatCard icon={<DollarSign />} color="budget" metric={`$${meta?.remaining_budget?.toFixed(0) ?? '...'}`} label="Remaining Budget" delay={4} />
            </div>
        </div>
    );
};
const PagePlaceholder = ({ title }) => <div className="p-8"><h1 className="text-4xl font-bold text-slate-100">{title}</h1></div>;

const BubbyTypingIndicator = () => (
  <div className="flex justify-start">
    <div className="px-4 py-3 rounded-3xl rounded-bl-lg bg-slate-700 text-slate-200 flex items-center gap-1.5">
      <motion.span className="w-2 h-2 bg-slate-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0 }} />
      <motion.span className="w-2 h-2 bg-slate-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} />
      <motion.span className="w-2 h-2 bg-slate-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} />
    </div>
  </div>
);

const ChatPage = () => {
  const { messages, isBubbyTyping } = useOutletContext();
  const chatContainerRef = useRef(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  return (
  <motion.div
    initial={{ y: "100%" }}
    animate={{ y: 0 }}
    exit={{ y: "100%" }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
    className="p-4 h-full flex flex-col bg-slate-900/50 rounded-t-3xl"
  >
    <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-hide pb-8">
      {messages && messages.map((msg, index) => (
        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-xs lg:max-w-md px-4 py-3 ${
            msg.sender === 'user' 
              ? 'bg-gradient-to-br from-emerald-500 to-green-500 text-white rounded-3xl rounded-br-lg' 
              : 'bg-slate-700 text-slate-200 rounded-3xl rounded-bl-lg'
          }`}>
            <p className="text-sm">{msg.text}</p>
          </div>
        </div>
      ))}
      {isBubbyTyping && (
        <BubbyTypingIndicator />
      )}
    </div>
  </motion.div>
  );
};

// --- NAVIGATION / LAYOUT ---
const AppLayout = () => {
  const [showCreateOptions, setShowCreateOptions] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [isBubbyTyping, setIsBubbyTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const speechRecognitionRef = useRef(null);
  const finalTranscript = useRef('');
  const navigate = useNavigate();
  const navRef = useRef(null);
  const footerRef = useRef(null);
  const location = useLocation();
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const navItems = [
    { to: "/", icon: <Home /> }, { to: "/calendar", icon: <CalendarIcon /> }, { to: "/budget", icon: <DollarSign /> },
    { to: "/bubbys/systems", icon: <Leaf /> }, { to: "/inventory", icon: <Package /> }, { to: "/settings", icon: <Settings /> }
  ];

  useEffect(() => {
    const activeLink = navRef.current?.querySelector('a.active');
    if (activeLink) {
        const { offsetLeft, clientWidth } = activeLink;
        setIndicatorStyle({ left: offsetLeft, width: clientWidth, opacity: 1 });
    }
  }, [location]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        speechRecognitionRef.current = new SpeechRecognition();
        const recognition = speechRecognitionRef.current;
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => {
          setIsListening(false);
          if (finalTranscript.current) {
            handleChatSubmit(null, finalTranscript.current);
            finalTranscript.current = '';
          }
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            finalTranscript.current = transcript;
            setChatMessage(transcript); // Update for visual feedback
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
            if (event.error === 'not-allowed') {
              const errorMsg = { text: "I can't hear you! Please allow microphone access in your browser settings.", sender: 'bubby' };
              setMessages(prev => [...prev, errorMsg]);
            }
        };
    }
  }, []);

  const handleMicClick = () => {
    if (!speechRecognitionRef.current) return;

    if (isListening) {
        speechRecognitionRef.current.stop();
    } else {
        speechRecognitionRef.current.start();
    }
  };

  const createOptions = [
    { icon: <Leaf />, label: 'Plant', path: '/plants/create' },
    { icon: <Layers />, label: 'Mix', path: '/mixes/create' },
    { icon: <ShieldCheck />, label: 'System', path: '/systems/create' },
    { icon: <ListTodo />, label: 'Todo', path: '/todos/create' },
    { icon: <ClipboardList />, label: 'Care Plan', path: '/care-plans/create' },
    { icon: <Flag />, label: 'Goal', path: '/goals/create' }
  ];

  const handleChatSubmit = async (e, voiceInput = null) => {
    if (e) e.preventDefault();
    const userMessageText = voiceInput || chatMessage.trim();
    if (userMessageText.length === 0) return;

    const userMessage = { text: userMessageText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setChatMessage('');
    navigate('/chat');

    setIsBubbyTyping(true);

    try {
      let currentChatId = chatId;
      if (!currentChatId) {
        const newChatSession = await simplePost(apiBuilder(APIS.app.chat).get(), { name: "New Chat" });
        currentChatId = newChatSession.id;
        setChatId(currentChatId);
      }

      const url = apiBuilder(APIS.app.chatWithMessage).setId(currentChatId).get();
      const response = await simplePost(url, { message: userMessageText });

      const bubbyMessage = { text: response.content, sender: 'bubby' };
      setMessages(prev => [...prev, bubbyMessage]);

    } catch (error) {
      console.error("Failed to get response from Bubby:", error);
      const errorMessage = { text: "Sorry, I'm having trouble connecting. Please try again later.", sender: 'bubby' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsBubbyTyping(false);
    }
  };

  return (
    <div className="h-screen grid grid-rows-[auto_1fr_auto]">
      <div className="max-w-4xl mx-auto px-4 pt-4 w-full">
          <Header />
      </div>
      <main className="mx-auto w-full h-full overflow-hidden max-w-4xl">
          <Outlet context={{ messages, isBubbyTyping }} />
      </main>
      <footer ref={footerRef} className="relative w-[calc(100%-2rem)] max-w-lg mx-auto mb-4 z-10">
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
           <form className="w-full relative h-12" onSubmit={handleChatSubmit}>
            <motion.button type="button" onClick={handleMicClick} className={`absolute left-1.5 top-1.5 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isListening ? 'bg-red-500/20 text-red-400' : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'}`}>
              <Mic size={18} />
            </motion.button>
            <input type="text" placeholder="Ask Bubby anything..." value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} className="w-full h-full bg-slate-900/50 rounded-full border-none pl-14 pr-14 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
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
        <Route path="chat" element={<ChatPage />} />
        <Route path="budget" element={<BudgetPage />} />        
        <Route path="bubbys" element={<Bubby />}>
          <Route path="systems" element={<Systems />}>
            <Route path=":id" element={<SystemUpdate />} />
          </Route>
          <Route path="care-plans" element={<CarePlans />}>
            <Route path=":id" element={<CarePlanUpdate />} />
          </Route>
          <Route path="mixes" element={<Mixes />}>
            <Route path=":id" element={<MixUpdate />} />
          </Route>
          <Route path="plants" element={<Plants />}>
            <Route path=":id" element={<PlantUpdate />} />
          </Route>
        </Route>
        <Route path="goals/create" element={<GoalCreate />} />
        <Route path="care-plans/create" element={<CarePlanCreate />} />
        <Route path="mixes/create" element={<MixCreate />} />
        <Route path="todos/create" element={<TodoCreate />} />
        <Route path="systems/create" element={<SystemCreate />} />
        <Route path="plants/create" element={<PlantCreate />} />
        <Route path="inventory" element={<PagePlaceholder title="Inventory" />} />
        <Route path="settings" element={<PagePlaceholder title="Settings" />} />
      </Route>
    </Routes>
  );
}
