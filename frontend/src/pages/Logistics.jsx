import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Truck, History, Box } from 'lucide-react';
import Swal from 'sweetalert2'; // Import SweetAlert2
import api from '../api';

export default function Logistics() {
    const [pendingProductions, setPendingProductions] = useState([]);
    const [historyProductions, setHistoryProductions] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [openPendingGroups, setOpenPendingGroups] = useState({});
    const [openHistoryGroups, setOpenHistoryGroups] = useState({});

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const response = await api.get('/productions');
            const allData = response.data;
            setPendingProductions(allData.filter(p => p.status_packing && !p.status_logistics && !p.is_rejected));
            setHistoryProductions(allData.filter(p => p.status_logistics));
        } catch (error) {
            console.error('Failed to fetch productions', error);
        }
    };

    const handleShip = async (unit) => {
        // --- KONFIRMASI SWEETALERT ---
        const result = await Swal.fire({
            title: 'Confirm Shipment?',
            text: `Unit ${unit.serial_number} will be moved to logistics.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#14B8A6', // Warna teal-500
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Yes, Ship it!',
            background: document.documentElement.classList.contains('dark') ? '#111827' : '#fff',
            color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
        });

        if (result.isConfirmed) {
            setLoading(true);
            try {
                await api.post(`/productions/${unit.id}/update-stage`, { stage: 'logistics' });
                
                // --- NOTIFIKASI SUKSES ---
                Swal.fire({
                    title: 'Shipped!',
                    text: 'Unit has been successfully moved to history.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    background: document.documentElement.classList.contains('dark') ? '#111827' : '#fff',
                    color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
                });

                fetchAllData(); 
            } catch (error) {
                Swal.fire('Error', 'Failed to update shipment status.', 'error');
            } finally {
                setLoading(false);
            }
        }
    };

    const togglePending = (name) => setOpenPendingGroups(prev => ({ ...prev, [name]: !prev[name] }));
    const toggleHistory = (name) => setOpenHistoryGroups(prev => ({ ...prev, [name]: !prev[name] }));
    
    const groupByGroup = (data) => {
        return data.reduce((groups, unit) => {
            const groupName = unit.group?.name || 'No Group';
            if (!groups[groupName]) groups[groupName] = [];
            groups[groupName].push(unit);
            return groups;
        }, {});
    };

    const groupedPending = groupByGroup(pendingProductions);
    const groupedHistory = groupByGroup(historyProductions);

    return (
        <div className="p-6 space-y-12 min-h-screen pb-24">
            <h2 className="text-3xl font-bold dark:text-white bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
                Logistics Department
            </h2>

            {/* --- SECTION: PENDING SHIPMENTS --- */}
            <section>
                <h3 className="text-xl font-semibold mb-4 dark:text-gray-200 flex items-center gap-2">
                    <Truck className="text-teal-500" /> Pending Shipments
                </h3>
                <div className="space-y-3">
                    {Object.entries(groupedPending).map(([groupName, units]) => (
                        <div key={`pending-${groupName}`} className="border border-teal-500/20 dark:border-teal-500/10 rounded-xl bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
                            <button onClick={() => togglePending(groupName)} className="w-full p-4 flex justify-between items-center hover:bg-teal-50/30 dark:hover:bg-teal-500/5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-teal-600 dark:text-teal-400">Origin: {groupName}</span>
                                    <span className="text-xs bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-300 px-2 py-1 rounded-full">{units.length} Awaiting</span>
                                </div>
                                {openPendingGroups[groupName] ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                            </button>

                            <AnimatePresence>
                                {openPendingGroups[groupName] && (
                                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t dark:border-gray-800">
                                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50/30 dark:bg-gray-800/20">
                                            {units.map(unit => (
                                                <div key={unit.id} className="flex justify-between items-center p-3 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl shadow-sm">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-gray-400 uppercase font-bold">Serial Number</span>
                                                        <span className="font-mono font-bold text-sm dark:text-gray-200">{unit.serial_number}</span>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleShip(unit)} // Kirim seluruh objek unit
                                                        disabled={loading}
                                                        className="bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-lg text-white text-xs font-bold transition-all flex items-center gap-2"
                                                    >
                                                        <Box size={14}/> Ship
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- SECTION: HISTORY --- */}
            <section>
                <h3 className="text-xl font-semibold mb-4 dark:text-gray-200 flex items-center gap-2">
                    <History className="text-gray-400" /> Shipment History
                </h3>
                <div className="space-y-3">
                    {Object.entries(groupedHistory).map(([groupName, units]) => (
                        <div key={`history-${groupName}`} className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
                            <button onClick={() => toggleHistory(groupName)} className="w-full p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-gray-600 dark:text-gray-300">Group: {groupName}</span>
                                    <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-1 rounded-full">{units.length} Shipped</span>
                                </div>
                                {openHistoryGroups[groupName] ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                            </button>

                            <AnimatePresence>
                                {openHistoryGroups[groupName] && (
                                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t dark:border-gray-800">
                                        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-2 bg-gray-50/50 dark:bg-gray-800/10">
                                            {units.map(unit => (
                                                <div key={unit.id} className="flex justify-between items-center text-[11px] p-3 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-lg">
                                                    <span className="font-mono font-bold text-teal-600 dark:text-teal-400">{unit.serial_number}</span>
                                                    <span className="text-gray-400 italic">{new Date(unit.status_logistics).toLocaleDateString('id-ID')}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}