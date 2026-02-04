import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
    CartesianGrid, Cell, PieChart, Pie 
} from 'recharts';
import { Activity, Truck, AlertOctagon, Package, ClipboardList } from 'lucide-react';
import api from '../api';

export default function AdminDashboard() {
    const [rawItems, setRawItems] = useState([]);
    const [stats, setStats] = useState({
        total: 0, assembly: 0, qc: 0, packing: 0, shipped: 0, rejected: 0,
    });
    
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
            setRawItems(data);

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

    // Data untuk Bar Chart
    const velocityData = [
        { name: 'Assembly', value: stats.assembly, color: '#A855F7' },
        { name: 'QC', value: stats.qc, color: '#F97316' },
        { name: 'Packing', value: stats.packing, color: '#6366F1' },
        { name: 'Shipped', value: stats.shipped, color: '#14B8A6' },
    ];

    // Data untuk Pie Chart (Reject Rate)
    const rejectPieData = [
        { name: 'Success', value: stats.total - stats.rejected, color: '#14B8A6' },
        { name: 'Rejected', value: stats.rejected, color: '#EF4444' },
    ];

    const openHistory = () => {
        const shippedItems = rawItems.filter(p => p.status_logistics && !p.is_rejected);
        setHistoryList(shippedItems);
        setShowModal(true);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold dark:text-white">System Overview</h2>
                <div className="flex items-center gap-2 text-teal-500 text-sm font-medium">
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-ping"></div>
                    Live Monitoring
                </div>
            </div>

            {/* --- STAT CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Units" value={stats.total} color="bg-blue-500" icon={<Package size={20}/>} />
                <StatCard title="In Assembly" value={stats.assembly} color="bg-purple-500" icon={<Activity size={20}/>} />
                <StatCard title="Awaiting QC" value={stats.qc} color="bg-orange-500" icon={<ClipboardList size={20}/>} />
                <StatCard title="Packing" value={stats.packing} color="bg-indigo-500" icon={<Package size={20}/>} />
                
                <div onClick={openHistory} className="cursor-pointer transform hover:scale-105 transition-all">
                    <StatCard title="Shipped (View History)" value={stats.shipped} color="bg-teal-500" icon={<Truck size={20}/>} />
                </div>

                <StatCard title="Rejected" value={stats.rejected} color="bg-red-500" icon={<AlertOctagon size={20}/>} />
            </div>

            {/* --- CHARTS SECTION --- */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Kolom Kiri: Velocity Bar Chart */}
                <div className="card-float p-6 h-80">
                    <h3 className="text-sm font-semibold mb-6 text-gray-500 uppercase tracking-wider">Production Velocity</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={velocityData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} />
                            <Tooltip 
                                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '10px', color: '#fff' }}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {velocityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Kolom Kanan: Reject Rate Pie Chart */}
                <div className="card-float p-6 h-80">
                    <h3 className="text-sm font-semibold mb-2 text-gray-500 uppercase tracking-wider">Reject Rate Analysis</h3>
                    <div className="flex h-full items-center">
                        <ResponsiveContainer width="60%" height="100%">
                            <PieChart>
                                <Pie
                                    data={rejectPieData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {rejectPieData.map((entry, index) => (
                                        <Cell key={`cell-pie-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        
                        <div className="w-40 space-y-5">
                            <div className="border-l-4 border-teal-500 pl-3">
                                <p className="text-[10px] text-gray-400 uppercase">Yield Rate</p>
                                <p className="text-2xl font-bold dark:text-white">
                                    {stats.total > 0 ? (((stats.total - stats.rejected) / stats.total) * 100).toFixed(1) : 0}%
                                </p>
                            </div>
                            <div className="border-l-4 border-red-500 pl-3">
                                <p className="text-[10px] text-gray-400 uppercase">Reject Rate</p>
                                <p className="text-2xl font-bold dark:text-white">
                                    {stats.total > 0 ? ((stats.rejected / stats.total) * 100).toFixed(1) : 0}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODAL HISTORY --- */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b dark:border-gray-800 flex justify-between items-center bg-teal-500 text-white">
                                <h3 className="text-xl font-bold flex items-center gap-2"><Truck size={20}/> Shipped History</h3>
                                <button onClick={() => setShowModal(false)} className="text-2xl hover:opacity-70">&times;</button>
                            </div>
                            <div className="p-6 max-h-[60vh] overflow-y-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-gray-500 text-xs uppercase tracking-widest border-b dark:border-gray-800">
                                            <th className="pb-3 px-2">Serial Number</th>
                                            <th className="pb-3 px-2">Group</th>
                                            <th className="pb-3 px-2 text-right">Date Shipped</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y dark:divide-gray-800">
                                        {historyList.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                <td className="py-3 px-2 font-mono font-bold text-teal-600 dark:text-teal-400">{item.serial_number}</td>
                                                <td className="py-3 px-2 dark:text-gray-300">{item.group?.name || 'Line-A'}</td>
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
        </div>
    );
}

function StatCard({ title, value, color, icon }) {
    return (
        <div className="card-float p-6 flex items-center justify-between group">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-white`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">{title}</p>
                    <p className="text-3xl font-bold dark:text-white mt-1">{value.toLocaleString()}</p>
                </div>
            </div>
            <div className={`w-2 h-2 rounded-full ${color} shadow-[0_0_10px_currentColor] opacity-50 group-hover:opacity-100 transition-opacity`}></div>
        </div>
    );
}