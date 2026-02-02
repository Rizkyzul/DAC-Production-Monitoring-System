import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

export default function AdminDashboard() {
    const [rawItems, setRawItems] = useState([]);
    const [stats, setStats] = useState({
        total: 0, assembly: 0, qc: 0, packing: 0, shipped: 0, rejected: 0,
    });
    
    // State untuk Modal Histori
    const [showModal, setShowModal] = useState(false);
    const [historyList, setHistoryList] = useState([]);

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/productions');
            const data = response.data;
            setRawItems(data); // Simpan semua data untuk difilter nanti

            setStats({
                total: data.length,
                assembly: data.filter(p => p.status_pra_assembly && !p.status_assembly && !p.is_rejected).length,
                qc: data.filter(p => p.status_assembly && !p.status_qc && !p.is_rejected).length,
                packing: data.filter(p => p.status_qc && !p.status_packing && !p.is_rejected).length,
                shipped: data.filter(p => p.status_logistics && !p.is_rejected).length,
                rejected: data.filter(p => p.is_rejected).length,
            });
        } catch (error) {
            console.error('Failed to fetch stats', error);
        }
    };

    // Fungsi membuka histori
    const openHistory = () => {
        const shippedItems = rawItems.filter(p => p.status_logistics && !p.is_rejected);
        setHistoryList(shippedItems);
        setShowModal(true);
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-8 dark:text-white">System Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Units" value={stats.total} color="bg-blue-500" />
                <StatCard title="In Assembly" value={stats.assembly} color="bg-purple-500" />
                <StatCard title="Awaiting QC" value={stats.qc} color="bg-orange-500" />
                <StatCard title="Packing" value={stats.packing} color="bg-indigo-500" />
                
                {/* Kartu Shipped yang bisa diklik */}
                <div onClick={openHistory} className="cursor-pointer transform hover:scale-105 transition-transform">
                    <StatCard title="Shipped (Click to View)" value={stats.shipped} color="bg-teal-500" />
                </div>

                <StatCard title="Rejected" value={stats.rejected} color="bg-red-500" />
            </div>

            {/* --- MODAL HISTORY --- */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b dark:border-gray-800 flex justify-between items-center bg-teal-500 text-white">
                                <h3 className="text-xl font-bold">Shipped Units History</h3>
                                <button onClick={() => setShowModal(false)} className="text-2xl font-bold hover:text-gray-200">&times;</button>
                            </div>
                            <div className="p-6 max-h-[60vh] overflow-y-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-gray-500 text-sm uppercase">
                                            <th className="pb-3 px-2">Serial Number</th>
                                            <th className="pb-3 px-2">Group</th>
                                            <th className="pb-3 px-2 text-right">Date Shipped</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y dark:divide-gray-800">
                                        {historyList.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                <td className="py-3 px-2 font-mono font-bold dark:text-teal-400">{item.serial_number}</td>
                                                <td className="py-3 px-2 dark:text-gray-300">{item.group?.name || 'N/A'}</td>
                                                <td className="py-3 px-2 text-right text-gray-500 text-sm">
                                                    {new Date(item.status_logistics).toLocaleDateString('id-ID')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card-float p-6 h-64 flex items-center justify-center">
                    <p className="text-gray-500 italic">Production Velocity Chart </p>
                </div>
                <div className="card-float p-6 h-64 flex items-center justify-center">
                    <p className="text-gray-500 italic">Rejection Rate by Group </p>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, color }) {
    return (
        <div className="card-float p-6 flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
                <p className="text-3xl font-bold dark:text-white mt-1">{value}</p>
            </div>
            <div className={`w-3 h-3 rounded-full ${color} shadow-[0_0_10px_currentColor]`}></div>
        </div>
    );
}