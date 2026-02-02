import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api';

export default function Logistics() {
    const [pendingProductions, setPendingProductions] = useState([]);
    const [historyProductions, setHistoryProductions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const response = await api.get('/productions');
            const allData = response.data;

            // 1. Data yang menunggu dikirim (Belum ada status_logistics)
            const pending = allData.filter(
                p => p.status_packing && !p.status_logistics && !p.is_rejected
            );
            setPendingProductions(pending);

            // 2. Data histori (Sudah ada status_logistics)
            const history = allData.filter(p => p.status_logistics);
            setHistoryProductions(history);
        } catch (error) {
            console.error('Failed to fetch productions', error);
        }
    };

    const handleShip = async (id) => {
        if (!window.confirm('Confirm shipment for this unit?')) return;

        setLoading(true);
        try {
            await api.post(`/productions/${id}/update-stage`, {
                stage: 'logistics',
            });

            setMessage(`Unit ${id} Shipped Successfully!`);
            fetchAllData(); // Refresh data untuk memindahkan unit ke histori
        } catch (error) {
            setMessage('Error shipping unit.');
        } finally {
            setLoading(false);
        }
    };

    // Fungsi Helper untuk mengelompokkan data berdasarkan Grup
    const groupByGroup = (data) => {
        return data.reduce((groups, unit) => {
            const groupName = unit.group?.name || 'No Group';
            if (!groups[groupName]) {
                groups[groupName] = [];
            }
            groups[groupName].push(unit);
            return groups;
        }, {});
    };

    const groupedHistory = groupByGroup(historyProductions);

    return (
        <div className="p-6 space-y-10">
            <h2 className="text-3xl font-bold dark:text-white bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
                Logistics Department
            </h2>

            {/* --- SECTION: PENDING SHIPMENT --- */}
            <section>
                <h3 className="text-xl font-semibold mb-4 dark:text-gray-200 flex items-center">
                    🚢 Pending Shipments
                </h3>
                <div className="card-float overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-700">
                            <tr>
                                <th className="p-4 dark:text-gray-300">Serial Number</th>
                                <th className="p-4 dark:text-gray-300">Origin Group</th>
                                <th className="p-4 dark:text-gray-300 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingProductions.map((unit) => (
                                <tr key={unit.id} className="border-b dark:border-gray-800">
                                    <td className="p-4 font-mono font-bold dark:text-white">{unit.serial_number}</td>
                                    <td className="p-4 dark:text-gray-300">{unit.group?.name}</td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => handleShip(unit.id)}
                                            disabled={loading}
                                            className="btn-primary bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-lg text-white"
                                        >
                                            Ship Unit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* --- SECTION: HISTORY PER GROUP --- */}
            <section>
                <h3 className="text-xl font-semibold mb-4 dark:text-gray-200 flex items-center">
                    📜 Shipment History (by Group)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.keys(groupedHistory).length === 0 && (
                        <p className="text-gray-500 italic">No history available yet.</p>
                    )}
                    
                    {Object.entries(groupedHistory).map(([groupName, units]) => (
                        <motion.div 
                            key={groupName}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm"
                        >
                            <h4 className="text-lg font-bold mb-3 text-teal-600 dark:text-teal-400 border-b dark:border-gray-700 pb-2">
                                Group: {groupName}
                            </h4>
                            <div className="max-h-60 overflow-y-auto space-y-2">
                                {units.map(unit => (
                                    <div key={unit.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                        <span className="font-mono font-medium dark:text-gray-300">{unit.serial_number}</span>
                                        <span className="text-xs text-gray-500 italic">
                                            {new Date(unit.status_logistics).toLocaleDateString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-2 text-right text-xs font-semibold text-gray-400">
                                Total Units: {units.length}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}