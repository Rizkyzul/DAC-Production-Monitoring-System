import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api';

export default function Assembly() {
    const [productions, setProductions] = useState([]);
    const [selectedProduction, setSelectedProduction] = useState(null);
    const [serialNumber, setSerialNumber] = useState('');
    const [checklist, setChecklist] = useState({
        lcd: false,
        barcode: false,
        screws: false,
        cortana: false,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchPendingUnits();
    }, []);

    const fetchPendingUnits = async () => {
        try {
            const response = await api.get('/productions');
            // Filter for units that passed Pra-Assembly but haven't passed Assembly
            const pending = response.data.filter(
                p => p.status_pra_assembly && !p.status_assembly && !p.is_rejected
            );
            setProductions(pending);
        } catch (error) {
            console.error('Failed to fetch productions', error);
        }
    };

    const handleSelectUnit = (unit) => {
        setSelectedProduction(unit);
        setMessage('');
        setChecklist({ lcd: false, barcode: false, screws: false, cortana: false });
        setSerialNumber('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post(`/productions/${selectedProduction.id}/update-stage`, {
                stage: 'assembly',
                checklist_data: checklist,
            });

            // Also update SN separately (since it's a direct field, not staged timestamp)
            await api.put(`/productions/${selectedProduction.id}`, {
                serial_number: serialNumber
            });

            setMessage('Unit assembled successfully! Sent to QC.');
            setSelectedProduction(null);
            fetchPendingUnits();
        } catch (error) {
            setMessage('Error updating unit.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-8 dark:text-white bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">
                Assembly Station
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Pending Units List */}
                <div className="col-span-1 space-y-4">
                    <h3 className="text-xl font-bold dark:text-white">Pending Units ({productions.length})</h3>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                        {productions.length === 0 && (
                            <p className="text-gray-500">No units waiting for assembly.</p>
                        )}
                        {productions.map((unit) => (
                            <motion.div
                                key={unit.id}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => handleSelectUnit(unit)}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedProduction?.id === unit.id
                                        ? 'border-neon-purple bg-neon-purple/10'
                                        : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="text-xs font-mono text-gray-500">ID: {unit.id}</span>
                                        <p className="font-semibold dark:text-white mt-1">
                                            Group: {unit.group?.name}
                                        </p>
                                    </div>
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                        Ready
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Work Area */}
                <div className="col-span-1 md:col-span-2">
                    {selectedProduction ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card-float p-8"
                        >
                            <h3 className="text-2xl font-bold mb-6 dark:text-white">
                                Assembling Unit #{selectedProduction.id}
                            </h3>

                            <div className="mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Origin Group</p>
                                <p className="text-lg font-medium dark:text-white">{selectedProduction.group?.name}</p>
                                <p className="text-sm text-gray-500 mt-2">Leader</p>
                                <p className="text-medium dark:text-white">{selectedProduction.group?.leader_name}</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                                        Assign Serial Number (SN)
                                    </label>
                                    <input
                                        type="text"
                                        value={serialNumber}
                                        onChange={(e) => setSerialNumber(e.target.value)}
                                        className="input-neon w-full font-mono text-lg"
                                        placeholder="SN-XXXXXXXX"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={checklist.lcd}
                                            onChange={(e) => setChecklist({ ...checklist, lcd: e.target.checked })}
                                            className="w-5 h-5 accent-neon-purple"
                                        />
                                        <span className="dark:text-gray-300">LCD Installed</span>
                                    </label>

                                    <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={checklist.barcode}
                                            onChange={(e) => setChecklist({ ...checklist, barcode: e.target.checked })}
                                            className="w-5 h-5 accent-neon-purple"
                                        />
                                        <span className="dark:text-gray-300">Barcode Scanned</span>
                                    </label>

                                    <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={checklist.screws}
                                            onChange={(e) => setChecklist({ ...checklist, screws: e.target.checked })}
                                            className="w-5 h-5 accent-neon-purple"
                                        />
                                        <span className="dark:text-gray-300">All Screws Secured</span>
                                    </label>

                                    <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={checklist.cortana}
                                            onChange={(e) => setChecklist({ ...checklist, cortana: e.target.checked })}
                                            className="w-5 h-5 accent-neon-purple"
                                        />
                                        <span className="dark:text-gray-300">Cortana / OS Activated</span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !checklist.lcd || !checklist.barcode || !checklist.screws || !checklist.cortana || !serialNumber}
                                    className="btn-primary w-full bg-gradient-to-r from-neon-purple to-neon-pink disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : 'Complete Assembly'}
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-12">
                            Select a pending unit to start assembly
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
