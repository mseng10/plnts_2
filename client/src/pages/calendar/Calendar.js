import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Flag, Zap } from 'lucide-react';
import dayjs from 'dayjs';

import { useTodos } from '../../hooks/useTodos';
import { useGoals } from '../../hooks/useGoals';

// Helper to group todos by date for efficient lookup
const groupTodosByDate = (todos) => {
    if (!todos) return {};
    return todos.reduce((acc, todo) => {
        const date = dayjs(todo.due_on).format('YYYY-MM-DD');
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(todo);
        return acc;
    }, {});
};

// Helper to group goals by the last day of their due month
const groupGoalsByDate = (goals) => {
    if (!goals) return {};
    return goals.reduce((acc, goal) => {
        const date = dayjs(goal.due_month).endOf('month').format('YYYY-MM-DD');
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(goal);
        return acc;
    }, {});
};

const CalendarDateCard = ({ date, todos, onResolve }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl shadow-black/30 flex flex-col h-full"
        >
            <h3 className="text-lg font-semibold text-slate-100 mb-1">{date.format('dddd')}</h3>
            <p className="text-sm text-slate-400 mb-4">{date.format('MMMM D, YYYY')}</p>
            
            <div className="overflow-y-auto flex-grow pr-2 -mr-2">
                {todos && todos.length > 0 ? (
                    <ul className="space-y-3">
                        {todos.map((todo) => (
                            <li key={todo.id} className="bg-slate-900/50 p-3 rounded-lg flex items-center justify-between transition-all hover:bg-slate-900">
                                <span className="text-sm text-slate-300">{todo.name}</span>
                                <button onClick={() => onResolve(todo.id)} className="w-7 h-7 flex items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors">
                                    <Check size={16} />
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <Zap size={40} className="text-slate-600 mb-2" />
                        <p className="text-sm font-medium text-slate-500">No events for this day.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const CalendarItem = ({ item, type, onDragStart }) => {
    const isGoal = type === 'goal';
    const bgColor = isGoal ? 'bg-amber-500/20' : 'bg-sky-500/20';
    const textColor = isGoal ? 'text-amber-400' : 'text-sky-400';
    const Icon = isGoal ? Flag : Check;
    return (
        <div draggable={!isGoal} onDragStart={(e) => onDragStart(e, item)} className={`flex items-center gap-1.5 text-xs font-medium ${textColor} ${bgColor} rounded px-1.5 py-0.5 mb-1 truncate ${!isGoal ? 'cursor-grab' : 'cursor-default'}`}>
            <Icon size={12} /> <span className="truncate">{item.name}</span>
        </div>
    );
};

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar = () => {
    const { todos, isLoading: todosLoading, error: todosError, resolveTodo, updateTodo } = useTodos();
    const { goals, isLoading: goalsLoading, error: goalsError } = useGoals();
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [selectedDate, setSelectedDate] = useState(null);
    const [draggedOverDate, setDraggedOverDate] = useState(null);

    // Auto-select today's date on initial load
    useEffect(() => {
        setSelectedDate(dayjs());
    }, []);

    const handleDateClick = (date) => {
        setSelectedDate(prev => (prev && prev.isSame(date, 'day') ? null : date));
    };

    const handleDragStart = (e, todo) => {
        e.dataTransfer.setData('application/json', JSON.stringify(todo));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = async (e, newDate) => {
        e.preventDefault();
        setDraggedOverDate(null);
        try {
            const todo = JSON.parse(e.dataTransfer.getData('application/json'));
            const originalDate = dayjs(todo.due_on);

            if (originalDate.isSame(newDate, 'day')) {
                return;
            }

            await updateTodo({ id: todo.id, due_on: newDate.toISOString() });
        } catch (err) {
            console.error("Failed to update todo date via drag and drop:", err);
        }
    };
    
    const todosByDate = useMemo(() => groupTodosByDate(todos), [todos]);
    const goalsByDate = useMemo(() => groupGoalsByDate(goals), [goals]);

    const calendarDays = useMemo(() => {
        const startOfMonth = currentDate.startOf('month');
        const endOfMonth = currentDate.endOf('month');
        const startOfWeek = startOfMonth.startOf('week');
        const endOfWeek = endOfMonth.endOf('week');

        const days = [];
        let day = startOfWeek;

        while (day.isBefore(endOfWeek, 'day') || day.isSame(endOfWeek, 'day')) {
            days.push(day);
            day = day.add(1, 'day');
        }
        return days;
    }, [currentDate]);

    const handlePrevMonth = () => {
        setCurrentDate(currentDate.subtract(1, 'month'));
    };

    const handleNextMonth = () => {
        setCurrentDate(currentDate.add(1, 'month'));
    };

    const handleResolve = (todoId) => {
        resolveTodo(todoId);
    };

    if (todosLoading || goalsLoading) return <div className="text-slate-400">Loading Calendar...</div>;
    if (todosError || goalsError) return <div className="text-red-400">Error loading calendar data.</div>;

    return (
        <div className="flex gap-4 p-4 h-full">
            <div className="flex-grow flex flex-col min-w-0">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-slate-800/50 transition-colors">
                        <ChevronLeft className="text-slate-400" />
                    </button>
                    <h2 className="text-xl font-semibold text-slate-200">
                        {currentDate.format('MMMM YYYY')}
                    </h2>
                    <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-slate-800/50 transition-colors">
                        <ChevronRight className="text-slate-400" />
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 mb-2">
                    {weekdays.map(weekday => (
                        <div key={weekday}>{weekday}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 grid-rows-5 gap-2 flex-grow">
                    {calendarDays.map((date, index) => {
                        const dateKey = date.format('YYYY-MM-DD');
                        const dayTodos = todosByDate[dateKey] || [];
                        const dayGoals = goalsByDate[dateKey] || [];
                        const isCurrentMonth = date.isSame(currentDate, 'month');
                        const isToday = date.isSame(dayjs(), 'day');
                        const isSelected = selectedDate && date.isSame(selectedDate, 'day');
                        const isDraggedOver = draggedOverDate && date.isSame(draggedOverDate, 'day');

                        return (
                            <div
                                key={index}
                                onClick={() => handleDateClick(date)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, date)}
                                onDragEnter={() => setDraggedOverDate(date)}
                                onDragLeave={() => setDraggedOverDate(null)}
                                className={`
                                    rounded-xl p-2 flex flex-col cursor-pointer transition-all duration-200
                                    ${isCurrentMonth ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-900/30 border-transparent'}
                                    ${isSelected ? 'bg-emerald-500/10 border-emerald-500/50' : ''}
                                    ${isDraggedOver ? 'border-emerald-500 scale-105' : 'border'}
                                `}
                            >
                                <div className={`font-bold text-sm mb-1 ${isToday ? 'text-emerald-400' : isCurrentMonth ? 'text-slate-300' : 'text-slate-600'}`}>
                                        {date.format('D')}
                                </div>
                                <div className="flex-grow overflow-y-auto -mr-1 pr-1">
                                    {dayTodos.map(todo => <CalendarItem key={`t-${todo.id}`} item={todo} type="todo" onDragStart={handleDragStart} />)}
                                    {dayGoals.map(goal => <CalendarItem key={`g-${goal.id}`} item={goal} type="goal" onDragStart={handleDragStart} />)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <AnimatePresence>
                {selectedDate && (
                    <motion.div
                        className="w-80 flex-shrink-0"
                        initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                        animate={{ width: 320, opacity: 1, marginLeft: 16 }}
                        exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        <CalendarDateCard 
                            date={selectedDate} 
                            todos={todosByDate[selectedDate.format('YYYY-MM-DD')] || []} 
                            onResolve={handleResolve} 
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Calendar;
