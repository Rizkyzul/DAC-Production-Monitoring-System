import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import { useNavigate } from 'react-router-dom'; // PENTING

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    
    const { login } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate(); // PENTING

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            // Jika sukses, pindah ke dashboard
            navigate('/dashboard'); 
        } catch (err) {
            // Menangkap error dari backend
            setError(err.response?.data?.message || 'Email atau Password salah!');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-dark-bg dark:via-gray-900 dark:to-gray-950">
            <button
                type="button"
                onClick={toggleTheme}
                className="absolute top-6 right-6 p-3 rounded-full bg-gray-200 dark:bg-gray-800 hover:scale-110 transition-transform"
            >
                {isDark ? '🌞' : '🌙'}
            </button>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-center mb-8"
                >
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">
                        DAC
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Production Monitoring System</p>
                </motion.div>

                <motion.form
                    onSubmit={handleSubmit}
                    className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 space-y-6 border border-gray-100 dark:border-gray-700"
                    whileHover={{ scale: 1.01 }}
                >
                    <h2 className="text-2xl font-bold text-center dark:text-white">Login</h2>

                    {error && (
                        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-neon-cyan outline-none"
                                required
                                placeholder="user@dac.com"
                            />
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-neon-cyan outline-none"
                                required
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-[38px] text-gray-500"
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors">
                        Login
                    </button>
                </motion.form>

                <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
                    Muhammad Rizky Zulkarnaen | 4136597 | Teknik Informatika 
                    <br />
                    TUGAS DAC © 2026

                </p>
            </motion.div>
        </div>
    );
}