import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PraAssembly from './PraAssembly';
import Assembly from './Assembly';
import QC from './QC';
import Packing from './Packing';
import Logistics from './Logistics';
import AdminDashboard from './AdminDashboard';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    const getRoleName = () => {
        const roleMap = {
            'admin': 'Administrator',
            'pra-assembly': 'Pra-Assembly',
            'assembly': 'Assembly',
            'qc': 'Quality Control',
            'packing': 'Packing',
            'logistics': 'Logistics',
        };
        return roleMap[user?.role?.name] || 'User';
    };

    const renderRoleView = () => {
        switch (user?.role?.name) {
            case 'pra-assembly': return <PraAssembly />;
            case 'assembly': return <Assembly />;
            case 'qc': return <QC />;
            case 'packing': return <Packing />;
            case 'logistics': return <Logistics />;
            case 'admin': return <AdminDashboard />;
            default: return (
                <div className="text-center py-20">
                    <p className="text-gray-600 dark:text-gray-400">
                        Welcome! Select a module to begin.
                    </p>
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-dark-bg dark:via-gray-900 dark:to-gray-950">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b-2 border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center space-x-4"
                    >
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                            DAC
                        </h1>
                        <span className="hidden md:block text-sm text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50">
                            {getRoleName()}
                        </span>
                    </motion.div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                        >
                            {isDark ? '🌞' : '🌙'}
                        </button>
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold dark:text-white">{user?.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role?.name}</p>
                        </div>
                        <button onClick={logout} className="btn-danger text-sm px-4 py-2">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {renderRoleView()}
            </main>
        </div>
    );
}
