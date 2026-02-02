import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function PraAssembly() {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [checklist, setChecklist] = useState({
        physical: false,
        ram: false,
        ssd: false,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await api.get('/groups');
            setGroups(response.data);
        } catch (error) {
            console.error('Failed to fetch groups', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // Create new production record
            await api.post('/productions', {
                group_id: selectedGroup,
                status_pra_assembly: new Date().toISOString(),
                checklist_data: checklist,
            });

            setMessage('Unit passed Pra-Assembly check! Sent to Assembly.');
            setChecklist({ physical: false, ram: false, ssd: false });
            setSelectedGroup('');
        } catch (error) {
            setMessage('Error submitting unit.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-8 dark:text-white bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                Pra-Assembly Station
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card-float p-6"
                >
                    <h3 className="text-xl font-bold mb-4 dark:text-white">New Unit Entry</h3>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                                Select Assembly Group
                            </label>
                            <select
                                value={selectedGroup}
                                onChange={(e) => setSelectedGroup(e.target.value)}
                                className="input-neon w-full dark:bg-gray-800 dark:text-white"
                                required
                            >
                                <option value="">-- Select Group --</option>
                                {groups.map((group) => (
                                    <option key={group.id} value={group.id}>
                                        {group.name} (Leader: {group.leader_name})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-semibold dark:text-gray-300">Checklist</h4>

                            <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                                <input
                                    type="checkbox"
                                    checked={checklist.physical}
                                    onChange={(e) => setChecklist({ ...checklist, physical: e.target.checked })}
                                    className="w-5 h-5 accent-neon-cyan"
                                />
                                <span className="dark:text-gray-300">Physical Check (No Scratches/Dents)</span>
                            </label>

                            <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                                <input
                                    type="checkbox"
                                    checked={checklist.ram}
                                    onChange={(e) => setChecklist({ ...checklist, ram: e.target.checked })}
                                    className="w-5 h-5 accent-neon-cyan"
                                />
                                <span className="dark:text-gray-300">RAM Installed</span>
                            </label>

                            <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                                <input
                                    type="checkbox"
                                    checked={checklist.ssd}
                                    onChange={(e) => setChecklist({ ...checklist, ssd: e.target.checked })}
                                    className="w-5 h-5 accent-neon-cyan"
                                />
                                <span className="dark:text-gray-300">SSD Installed</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !checklist.physical || !checklist.ram || !checklist.ssd || !selectedGroup}
                            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : 'Approve & Send to Assembly'}
                        </button>
                    </form>

                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-4 p-3 rounded-lg text-center ${message.includes('Error')
                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                }`}
                        >
                            {message}
                        </motion.div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    <div className="card-float p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                        <h3 className="text-xl font-bold mb-2">Instructions</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-300">
                            <li>Verify physical condition of the chassis.</li>
                            <li>Ensure RAM modules are seated correctly.</li>
                            <li>Check SSD installation.</li>
                            <li>Select the correct Assembly Group responsible for this batch.</li>
                        </ul>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
