import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, Filter, Plus, ExternalLink, Edit2, X, Save, DollarSign, Hash, Link as LinkIcon, List, ChevronUp, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { APIS, apiBuilder, simpleFetch, simplePatch } from '../../api';

const EditModal = ({ item, types, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: item.name,
        cost: item.cost,
        quantity: item.quantity,
        url: item.url || '',
        inventory_type_id: item.inventory_type_id,
        data: { ...item.data }
    });

    const type = types.find(t => t.id === formData.inventory_type_id);
    const schema = type ? type.data_schema : {};

    const renderDynamicField = (key, fieldType) => {
        const commonClasses = "w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors text-sm";
        
        switch (fieldType) {
            case 'number':
                return <input type="number" value={formData.data[key] || ''} onChange={(e) => setFormData({ ...formData, data: { ...formData.data, [key]: parseFloat(e.target.value) } })} className={commonClasses} />;
            case 'date':
                return <input type="date" value={formData.data[key] || ''} onChange={(e) => setFormData({ ...formData, data: { ...formData.data, [key]: e.target.value } })} className={commonClasses} />;
            case 'boolean':
                return (
                    <div className="flex items-center">
                        <input type="checkbox" checked={!!formData.data[key]} onChange={(e) => setFormData({ ...formData, data: { ...formData.data, [key]: e.target.checked } })} className="w-5 h-5 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500 bg-slate-900/50" />
                    </div>
                );
            default:
                return <input type="text" value={formData.data[key] || ''} onChange={(e) => setFormData({ ...formData, data: { ...formData.data, [key]: e.target.value } })} className={commonClasses} />;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-800 border border-slate-700 rounded-3xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2"><Edit2 size={20} className="text-emerald-400"/> Edit Item</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-200"><X size={24}/></button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); onSave({ ...item, ...formData }); }} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">Name</label>
                        <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">URL</label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-3 text-slate-500" size={16} />
                            <input type="url" value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})} className="w-full bg-slate-900/50 border border-slate-600 rounded-xl pl-10 pr-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">Cost</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-3 text-slate-500" size={16} />
                                <input type="number" step="0.01" value={formData.cost} onChange={(e) => setFormData({...formData, cost: parseFloat(e.target.value)})} className="w-full bg-slate-900/50 border border-slate-600 rounded-xl pl-10 pr-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">Quantity</label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-3 text-slate-500" size={16} />
                                <input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})} className="w-full bg-slate-900/50 border border-slate-600 rounded-xl pl-10 pr-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500" />
                            </div>
                        </div>
                    </div>
                    
                    {Object.keys(schema).length > 0 && (
                        <div className="bg-slate-900/30 rounded-2xl p-4 border border-slate-700/30 space-y-3">
                            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2"><List size={16}/> Details</h3>
                            {Object.entries(schema).map(([key, fieldType]) => (
                                <div key={key}>
                                    <label className="block text-xs font-medium text-slate-500 mb-1 ml-1 capitalize">{key}</label>
                                    {renderDynamicField(key, fieldType)}
                                </div>
                            ))}
                        </div>
                    )}

                    <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-3 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-colors"><Save size={18}/> Save Changes</button>
                </form>
            </motion.div>
        </div>
    );
};

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [types, setTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [itemsData, typesData] = await Promise.all([
                    simpleFetch(apiBuilder(APIS.inventory.getAll).get()),
                    simpleFetch(apiBuilder(APIS.inventoryType.getAll).get())
                ]);
                setItems(itemsData);
                setTypes(typesData);
            } catch (error) {
                console.error("Failed to fetch inventory data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === 'all' || String(item.inventory_type_id) === selectedType;
        return matchesSearch && matchesType;
    });

    const totalCost = filteredItems.reduce((sum, item) => sum + ((item.cost || 0) * (item.quantity || 1)), 0);

    const getTypeName = (typeId) => {
        const type = types.find(t => t.id === typeId);
        return type ? type.name : 'Unknown';
    };

    const handleUpdate = async (updatedItem) => {
        try {
            await simplePatch(apiBuilder(APIS.inventory.updateOne).setId(updatedItem.id).get(), updatedItem);
            setItems(items.map(i => i.id === updatedItem.id ? updatedItem : i));
            setEditingItem(null);
        } catch (error) {
            console.error("Failed to update item", error);
        }
    };

    return (
        <div className="p-4 h-full flex flex-col">
            {/* Header & Search */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                        <Package className="text-emerald-400" /> Inventory
                        <span className="text-sm font-medium text-slate-400 bg-slate-800/50 px-2 py-1 rounded-lg border border-slate-700/50 ml-2">
                            ${totalCost.toFixed(2)}
                        </span>
                    </h1>
                    <Link to="/inventory/create" className="bg-emerald-500 hover:bg-emerald-400 text-white p-2 rounded-xl transition-colors shadow-lg shadow-emerald-500/20">
                        <Plus size={20} />
                    </Link>
                </div>

                <div className="flex gap-2">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                    </div>
                    <div className="relative min-w-[120px]">
                         <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="w-full h-full bg-slate-800/50 border border-slate-700 rounded-xl pl-9 pr-8 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 appearance-none text-sm"
                        >
                            <option value="all">All Types</option>
                            {types.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="flex-grow overflow-y-auto space-y-3 pb-20 pr-2 -mr-2">
                {isLoading ? (
                    <div className="text-center text-slate-500 py-8">Loading inventory...</div>
                ) : filteredItems.length > 0 ? (
                    filteredItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 flex justify-between items-center shadow-sm hover:bg-slate-800 transition-colors"
                        >
                            <div>
                                <h3 className="font-semibold text-slate-200">{item.name}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-xs px-2 py-0.5 rounded-md bg-slate-700 text-slate-300">
                                        {getTypeName(item.inventory_type_id)}
                                    </span>
                                    {item.cost > 0 && (
                                        <span className="text-xs text-slate-400">${item.cost.toFixed(2)}</span>
                                    )}
                                    <div className="flex items-center gap-1 bg-slate-900/50 rounded-lg border border-slate-700/50 px-1.5 py-0.5">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleUpdate({ ...item, quantity: Math.max(0, (item.quantity || 0) - 1) }); }}
                                            className="p-0.5 text-slate-400 hover:text-red-400 transition-colors"
                                        >
                                            <ChevronDown size={12} />
                                        </button>
                                        <span className="text-xs font-medium text-slate-300 min-w-[16px] text-center">{item.quantity}</span>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleUpdate({ ...item, quantity: (item.quantity || 0) + 1 }); }}
                                            className="p-0.5 text-slate-400 hover:text-emerald-400 transition-colors"
                                        >
                                            <ChevronUp size={12} />
                                        </button>
                                    </div>
                                </div>
                                {item.data && Object.keys(item.data).length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {Object.entries(item.data).map(([key, value]) => (
                                            <span key={key} className="text-[10px] bg-slate-900/50 border border-slate-700/50 px-1.5 py-0.5 rounded text-slate-400">
                                                <span className="font-medium text-slate-500 mr-1 capitalize">{key}:</span>
                                                {String(value)}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                {item.url && (
                                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-emerald-400 transition-colors">
                                        <ExternalLink size={18} />
                                    </a>
                                )}
                                <button onClick={() => setEditingItem(item)} className="p-2 text-slate-400 hover:text-blue-400 transition-colors">
                                    <Edit2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center text-slate-500 py-8">
                        {searchTerm ? 'No items found matching your search.' : 'No inventory items yet.'}
                    </div>
                )}
            </div>
            <AnimatePresence>
                {editingItem && (
                    <EditModal item={editingItem} types={types} onClose={() => setEditingItem(null)} onSave={handleUpdate} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Inventory;