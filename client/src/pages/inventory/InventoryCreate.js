import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Save, Tag, DollarSign, Hash, Type, List, Calendar, Plus, Trash2, AlertCircle, Link } from 'lucide-react';
import { APIS, apiBuilder, simpleFetch, simplePost } from '../../api';

const InventoryCreate = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('item'); // 'item' | 'type'
    const [types, setTypes] = useState([]);
    const [isLoadingTypes, setIsLoadingTypes] = useState(false);
    const [error, setError] = useState(null);

    // --- ITEM FORM STATE ---
    const [itemName, setItemName] = useState('');
    const [itemUrl, setItemUrl] = useState('');
    const [itemCost, setItemCost] = useState('');
    const [itemQuantity, setItemQuantity] = useState(1);
    const [selectedTypeId, setSelectedTypeId] = useState('');
    const [itemData, setItemData] = useState({});

    // --- TYPE FORM STATE ---
    const [typeName, setTypeName] = useState('');
    const [schemaFields, setSchemaFields] = useState([]); // Array of { key: '', type: 'text' }

    // Fetch types on mount
    useEffect(() => {
        const fetchTypes = async () => {
            setIsLoadingTypes(true);
            try {
                const data = await simpleFetch(apiBuilder(APIS.inventoryType.getAll).get());
                setTypes(data);
            } catch (err) {
                console.error("Failed to fetch inventory types", err);
            } finally {
                setIsLoadingTypes(false);
            }
        };
        fetchTypes();
    }, []);

    // Reset item data when type changes
    useEffect(() => {
        setItemData({});
    }, [selectedTypeId]);

    const handleItemSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const payload = {
                name: itemName,
                url: itemUrl,
                cost: parseFloat(itemCost) || 0,
                quantity: parseInt(itemQuantity) || 1,
                inventory_type_id: selectedTypeId || null,
                data: itemData
            };
            await simplePost(apiBuilder(APIS.inventory.create).get(), payload);
            navigate('/inventory');
        } catch (err) {
            setError("Failed to create inventory item.");
            console.error(err);
        }
    };

    const handleTypeSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            // Convert array of fields back to dict schema
            const data_schema = schemaFields.reduce((acc, field) => {
                if (field.key.trim()) {
                    acc[field.key.trim()] = field.type;
                }
                return acc;
            }, {});

            const payload = {
                name: typeName,
                data_schema
            };
            await simplePost(apiBuilder(APIS.inventoryType.create).get(), payload);
            
            // Refresh types and switch back to item view
            const data = await simpleFetch(apiBuilder(APIS.inventoryType.getAll).get());
            setTypes(data);
            setActiveTab('item');
            setTypeName('');
            setSchemaFields([]);
        } catch (err) {
            setError("Failed to create inventory type.");
            console.error(err);
        }
    };

    const addSchemaField = () => {
        setSchemaFields([...schemaFields, { key: '', type: 'text' }]);
    };

    const removeSchemaField = (index) => {
        setSchemaFields(schemaFields.filter((_, i) => i !== index));
    };

    const updateSchemaField = (index, field, value) => {
        const newFields = [...schemaFields];
        newFields[index] = { ...newFields[index], [field]: value };
        setSchemaFields(newFields);
    };

    const getSelectedTypeSchema = () => {
        const type = types.find(t => t.id === selectedTypeId);
        return type ? type.data_schema : {};
    };

    const renderDynamicField = (key, type) => {
        const commonClasses = "w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors";
        
        switch (type) {
            case 'number':
                return (
                    <input
                        type="number"
                        value={itemData[key] || ''}
                        onChange={(e) => setItemData({ ...itemData, [key]: parseFloat(e.target.value) })}
                        className={commonClasses}
                        placeholder={`Enter ${key}...`}
                    />
                );
            case 'date':
                return (
                    <input
                        type="date"
                        value={itemData[key] || ''}
                        onChange={(e) => setItemData({ ...itemData, [key]: e.target.value })}
                        className={commonClasses}
                    />
                );
            case 'boolean':
                return (
                    <div className="flex items-center h-full">
                        <input
                            type="checkbox"
                            checked={!!itemData[key]}
                            onChange={(e) => setItemData({ ...itemData, [key]: e.target.checked })}
                            className="w-5 h-5 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500 bg-slate-900/50"
                        />
                        <span className="ml-2 text-slate-400 text-sm">Yes/No</span>
                    </div>
                );
            default: // text
                return (
                    <input
                        type="text"
                        value={itemData[key] || ''}
                        onChange={(e) => setItemData({ ...itemData, [key]: e.target.value })}
                        className={commonClasses}
                        placeholder={`Enter ${key}...`}
                    />
                );
        }
    };

    return (
        <div className="p-4 max-w-2xl mx-auto mb-20">
            {/* Header / Tabs */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-1.5 flex mb-6 shadow-lg">
                <button
                    onClick={() => setActiveTab('item')}
                    className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'item' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    <Package size={18} /> Create Item
                </button>
                <button
                    onClick={() => setActiveTab('type')}
                    className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'type' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    <Tag size={18} /> Create Type
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'item' ? (
                    <motion.form
                        key="item-form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        onSubmit={handleItemSubmit}
                        className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-xl space-y-6"
                    >
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-2 ml-1">Item Name</label>
                            <div className="relative">
                                <Package className="absolute left-4 top-3.5 text-slate-500" size={20} />
                                <input type="text" required value={itemName} onChange={(e) => setItemName(e.target.value)} className="w-full bg-slate-900/50 border border-slate-600 rounded-xl pl-12 pr-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors" placeholder="e.g., Ceramic Pot 5-inch" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-2 ml-1">URL</label>
                            <div className="relative">
                                <Link className="absolute left-4 top-3.5 text-slate-500" size={20} />
                                <input type="url" value={itemUrl} onChange={(e) => setItemUrl(e.target.value)} className="w-full bg-slate-900/50 border border-slate-600 rounded-xl pl-12 pr-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors" placeholder="https://..." />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-2 ml-1">Cost</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-3.5 text-slate-500" size={20} />
                                    <input type="number" step="0.01" value={itemCost} onChange={(e) => setItemCost(e.target.value)} className="w-full bg-slate-900/50 border border-slate-600 rounded-xl pl-12 pr-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors" placeholder="0.00" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-2 ml-1">Quantity</label>
                                <div className="relative">
                                    <Hash className="absolute left-4 top-3.5 text-slate-500" size={20} />
                                    <input type="number" value={itemQuantity} onChange={(e) => setItemQuantity(e.target.value)} className="w-full bg-slate-900/50 border border-slate-600 rounded-xl pl-12 pr-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors" placeholder="1" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-2 ml-1">Inventory Type</label>
                            <select value={selectedTypeId} onChange={(e) => setSelectedTypeId(e.target.value)} className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors appearance-none">
                                <option value="">Select a type...</option>
                                {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>

                        {/* Dynamic Fields */}
                        {selectedTypeId && Object.keys(getSelectedTypeSchema()).length > 0 && (
                            <div className="bg-slate-900/30 rounded-2xl p-4 border border-slate-700/30 space-y-4">
                                <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2"><List size={16}/> Type Details</h3>
                                {Object.entries(getSelectedTypeSchema()).map(([key, type]) => (
                                    <div key={key}>
                                        <label className="block text-xs font-medium text-slate-500 mb-1.5 ml-1 capitalize">{key}</label>
                                        {renderDynamicField(key, type)}
                                    </div>
                                ))}
                            </div>
                        )}

                        {error && <div className="text-red-400 text-sm text-center flex items-center justify-center gap-2"><AlertCircle size={16}/> {error}</div>}

                        <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-green-400 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2">
                            <Save size={20} /> Save Item
                        </button>
                    </motion.form>
                ) : (
                    <motion.form
                        key="type-form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        onSubmit={handleTypeSubmit}
                        className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-xl space-y-6"
                    >
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-2 ml-1">Type Name</label>
                            <div className="relative">
                                <Tag className="absolute left-4 top-3.5 text-slate-500" size={20} />
                                <input type="text" required value={typeName} onChange={(e) => setTypeName(e.target.value)} className="w-full bg-slate-900/50 border border-slate-600 rounded-xl pl-12 pr-4 py-3 text-slate-100 focus:outline-none focus:border-blue-500 transition-colors" placeholder="e.g., Soil, Pot, Tool" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="block text-xs font-medium text-slate-400 ml-1">Data Schema Fields</label>
                                <button type="button" onClick={addSchemaField} className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-2 py-1 rounded-lg transition-colors flex items-center gap-1"><Plus size={12}/> Add Field</button>
                            </div>
                            {schemaFields.map((field, index) => (
                                <div key={index} className="flex gap-2">
                                    <input type="text" value={field.key} onChange={(e) => updateSchemaField(index, 'key', e.target.value)} placeholder="Field Name" className="flex-grow bg-slate-900/50 border border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500" />
                                    <select value={field.type} onChange={(e) => updateSchemaField(index, 'type', e.target.value)} className="w-28 bg-slate-900/50 border border-slate-600 rounded-xl px-2 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500">
                                        <option value="text">Text</option>
                                        <option value="number">Number</option>
                                        <option value="date">Date</option>
                                        <option value="boolean">Boolean</option>
                                    </select>
                                    <button type="button" onClick={() => removeSchemaField(index)} className="w-10 flex items-center justify-center bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors"><Trash2 size={16}/></button>
                                </div>
                            ))}
                            {schemaFields.length === 0 && <div className="text-center text-slate-500 text-sm py-4 border border-dashed border-slate-700 rounded-xl">No custom fields defined.</div>}
                        </div>

                        {error && <div className="text-red-400 text-sm text-center flex items-center justify-center gap-2"><AlertCircle size={16}/> {error}</div>}

                        <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 hover:from-blue-400 hover:to-indigo-400 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2">
                            <Save size={20} /> Save Type
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InventoryCreate;