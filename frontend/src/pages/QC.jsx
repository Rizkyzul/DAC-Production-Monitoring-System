import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

export default function QC() {
    const [productions, setProductions] = useState([]);
    const [selectedProduction, setSelectedProduction] = useState(null);
    const [checklist, setChecklist] = useState({
        screen: false,
        sn_match: false,
        audio_ports: false,
    });
    const [loading, setLoading] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchAssemblyUnits();
    }, []);

    const fetchAssemblyUnits = async () => {
        try {
            const response = await api.get('/productions');
            // Filter for units that passed Assembly but haven't passed QC and aren't rejected (yet)
            const pending = response.data.filter(
                p => p.status_assembly && !p.status_qc && !p.is_rejected
            );
            setProductions(pending);
        } catch (error) {
            console.error('Failed to fetch productions', error);
        }
    };

    const handleSelectUnit = (unit) => {
        setSelectedProduction(unit);
        setMessage('');
        setChecklist({ screen: false, sn_match: false, audio_ports: false });
        setIsRejecting(false);
        setRejectReason('');
    };

    const handleApprove = async () => {
        setLoading(true);
        try {
            await api.post(`/productions/${selectedProduction.id}/update-stage`, {
                stage: 'qc',
                checklist_data: checklist,
            });
            setMessage('Unit PASSED QC! Sent to Packing.');
            setSelectedProduction(null);
            fetchAssemblyUnits();
        } catch (error) {
            setMessage('Error updating unit.');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        setLoading(true);
        try {
            await api.post(`/productions/${selectedProduction.id}/update-stage`, {
                stage: 'qc', // We still mark QC stage as "processed" but with rejection
                is_rejected: true,
                reject_reason: rejectReason,
            });
            setMessage('Unit REJECTED. Traceability logged.');
            setSelectedProduction(null);
            fetchAssemblyUnits();
        } catch (error) {
            setMessage('Error rejecting unit.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-8 dark:text-white bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Quality Control Station
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="col-span-1 space-y-4">
                    <input
                        type="text"
                        placeholder="Scan SN to Find..."
                        className="input-neon w-full mb-4"
                    />
                    <h3 className="text-xl font-bold dark:text-white">Awaiting QC ({productions.length})</h3>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                        {productions.map((unit) => (
                            <motion.div
                                key={unit.id}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => handleSelectUnit(unit)}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedProduction?.id === unit.id
                                        ? 'border-orange-500 bg-orange-500/10'
                                        : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-mono font-bold dark:text-white">{unit.serial_number}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            From: {unit.group?.name}
                                        </p>
                                    </div>
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        Inspect
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                    {selectedProduction ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="card-float p-8 border-orange-500"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-3xl font-mono font-bold dark:text-white">
                                    {selectedProduction.serial_number}
                                </h3>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 uppercase tracking-widest">Traceability Info</p>
                                    <p className="font-bold text-neon-cyan">{selectedProduction.group?.name}</p>
                                    <p className="text-sm dark:text-gray-400">Leader: {selectedProduction.group?.leader_name}</p>
                                </div>
                            </div>

                            {!isRejecting ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 gap-4">
                                        <label className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={checklist.screen}
                                                onChange={(e) => setChecklist({ ...checklist, screen: e.target.checked })}
                                                className="w-6 h-6 accent-orange-500"
                                            />
                                            <span className="text-lg dark:text-gray-300">Screen Display Check (No Dead Pixels)</span>
                                        </label>

                                        <label className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={checklist.sn_match}
                                                onChange={(e) => setChecklist({ ...checklist, sn_match: e.target.checked })}
                                                className="w-6 h-6 accent-orange-500"
                                            />
                                            <span className="text-lg dark:text-gray-300">Serial Number Match (System vs Physical)</span>
                                        </label>

                                        <label className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={checklist.audio_ports}
                                                onChange={(e) => setChecklist({ ...checklist, audio_ports: e.target.checked })}
                                                className="w-6 h-6 accent-orange-500"
                                            />
                                            <span className="text-lg dark:text-gray-300">Audio & Ports Functionality</span>
                                        </label>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            onClick={() => setIsRejecting(true)}
                                            className="flex-1 btn-danger py-3 text-lg"
                                        >
                                            ⚠ REJECT UNIT
                                        </button>
                                        <button
                                            onClick={handleApprove}
                                            disabled={loading || !checklist.screen || !checklist.sn_match || !checklist.audio_ports}
                                            className="flex-1 btn-primary bg-gradient-to-r from-green-500 to-emerald-600 disabled:opacity-50 py-3 text-lg"
                                        >
                                            ✅ APPROVE UNIT
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-200 dark:border-red-800"
                                >
                                    <h4 className="text-xl font-bold text-red-600 mb-4">Rejection Report</h4>
                                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                                        This unit will be flagged and traced back to <span className="font-bold text-white">{selectedProduction.group?.name}</span> (Leader: {selectedProduction.group?.leader_name}).
                                    </p>

                                    <textarea
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        className="w-full p-4 rounded-lg bg-white dark:bg-gray-950 border border-red-300 dark:border-red-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        rows="4"
                                        placeholder="Describe the defect in detail..."
                                    ></textarea>

                                    <div className="flex gap-4 mt-4">
                                        <button
                                            onClick={() => setIsRejecting(false)}
                                            className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-white"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleReject}
                                            disabled={!rejectReason}
                                            className="flex-1 btn-danger"
                                        >
                                            Confirm Rejection
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-12">
                            Scan or select a unit for QC Inspection
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
