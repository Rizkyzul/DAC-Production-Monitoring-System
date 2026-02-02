import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api';

export default function Packing() {
    const [productions, setProductions] = useState([]);
    const [selectedProduction, setSelectedProduction] = useState(null);
    const [checklist, setChecklist] = useState({
        adapter: false,
        accessories: false,
        warranty: false,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchQCUnits();
    }, []);

    const fetchQCUnits = async () => {
        try {
            const response = await api.get('/productions');
            // Filter for units that passed QC but haven't passed Packing
            const pending = response.data.filter(
                p => p.status_qc && !p.status_packing && !p.is_rejected
            );
            setProductions(pending);
        } catch (error) {
            console.error('Failed to fetch productions', error);
        }
    };

    const handleSelectUnit = (unit) => {
        setSelectedProduction(unit);
        setMessage('');
        setChecklist({ adapter: false, accessories: false, warranty: false });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post(`/productions/${selectedProduction.id}/update-stage`, {
                stage: 'packing',
                checklist_data: checklist,
            });

            setMessage('Unit Packed and Ready for Logistics!');
            setSelectedProduction(null);
            fetchQCUnits();
        } catch (error) {
            setMessage('Error updating unit.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-8 dark:text-white bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                Packing Station
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="col-span-1 space-y-4">
                    <h3 className="text-xl font-bold dark:text-white">To Be Worked ({productions.length})</h3>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                        {productions.map((unit) => (
                            <motion.div
                                key={unit.id}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => handleSelectUnit(unit)}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedProduction?.id === unit.id
                                        ? 'border-indigo-500 bg-indigo-500/10'
                                        : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-mono font-bold dark:text-white">{unit.serial_number}</p>
                                        <span className="text-xs text-green-600">PASSED QC</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                    {selectedProduction ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card-float p-8"
                        >
                            <h3 className="text-2xl font-bold mb-2 dark:text-white">
                                Packing Unit
                            </h3>
                            <p className="text-3xl font-mono text-indigo-400 mb-6">{selectedProduction.serial_number}</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-4">
                                    <label className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={checklist.adapter}
                                            onChange={(e) => setChecklist({ ...checklist, adapter: e.target.checked })}
                                            className="w-5 h-5 accent-indigo-500"
                                        />
                                        <span className="dark:text-gray-300">Adaptor / Charger Included</span>
                                    </label>

                                    <label className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={checklist.accessories}
                                            onChange={(e) => setChecklist({ ...checklist, accessories: e.target.checked })}
                                            className="w-5 h-5 accent-indigo-500"
                                        />
                                        <span className="dark:text-gray-300">Supporting Accessories</span>
                                    </label>

                                    <label className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={checklist.warranty}
                                            onChange={(e) => setChecklist({ ...checklist, warranty: e.target.checked })}
                                            className="w-5 h-5 accent-indigo-500"
                                        />
                                        <span className="dark:text-gray-300">Warranty Card & Manual Book</span>
                                    </label>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading || !checklist.adapter || !checklist.accessories || !checklist.warranty}
                                        className="btn-primary w-full bg-gradient-to-r from-indigo-500 to-blue-500 disabled:opacity-50"
                                    >
                                        {loading ? 'Processing...' : '📦 Complete Packing'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-12">
                            Select a unit to pack
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
