import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import { useNavigate } from 'react-router-dom'; 
import { Eye, EyeOff, Loader2 } from 'lucide-react'; // Tambah Loader2

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Tambahkan ini
    
    const { login } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true); // Mulai loading
        try {
            await login(email, password);
            navigate('/dashboard'); 
        } catch (err) {
            // Gunakan fallback error yang lebih aman
            setError(err.response?.data?.message || 'Email atau Password salah!');
        } finally {
            setIsLoading(false); // Selesai loading
        }
    };

    return (
        // Tambahkan relative di sini
        <div className="relative min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#020617] transition-colors duration-500 overflow-hidden">
            
            {/* Background Glow (Efek Anti-Gravity) */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />

            <button
                type="button"
                onClick={toggleTheme}
                className="absolute top-6 right-6 p-3 rounded-full bg-gray-200 dark:bg-gray-800 hover:scale-110 transition-all z-50"
            >
                {isDark ? '🌞' : '🌙'}
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md px-4 z-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
                        DAC
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium tracking-widest uppercase text-xs mt-2">
                        Production Monitoring System
                    </p>
                </div>

                <motion.form
                    onSubmit={handleSubmit}
                    className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 space-y-6 border border-gray-200 dark:border-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-none transition-all duration-300"
                    whileHover={{ y: -5 }}
                >
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Sign In</h2>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-3 rounded text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border rounded-xl dark:bg-black/20 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                                required
                                placeholder="name@dac.com"
                            />
                        </div>

                        <div className="space-y-2 relative">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border rounded-xl dark:bg-black/20 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                                    required
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Login'}
                    </button>
                </motion.form>

                <footer className="text-center text-[10px] text-gray-400 dark:text-gray-600 mt-10 leading-relaxed uppercase tracking-tighter">
                    {/* Data identitas kamu tetap aman di sini */}
                    Muhammad Rizky Zulkarnaen | 4136597 | Teknik Informatika 
                    <br />
                    TUGAS DAC &copy; 2026
                </footer>
            </motion.div>
        </div>
    );
}