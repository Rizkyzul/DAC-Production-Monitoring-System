import { createContext, useContext, useState, useEffect } from 'react';
import api from './api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const response = await api.get('/me');
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user', error);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        // Jangan gunakan try-catch di sini agar error dilempar ke Login.jsx
        const response = await api.post('/login', { email, password });
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        return response.data;
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading ? children : (
                <div className="min-h-screen flex items-center justify-center dark:bg-gray-950 dark:text-white">
                    Loading...
                </div>
            )}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);