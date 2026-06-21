
import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../Services/api';
import { sessionUtils } from '../utils/sessionUtils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [permissao, setPermissao] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (sessionUtils.isSessionValid()) {
            const storedUser = localStorage.getItem('userData');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } else {
            sessionUtils.clearSession();
            setUser(null);
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/token/', { username, password });

            localStorage.setItem('access_token', response.access);

            sessionUtils.startSession();
            if (response.user) {
                localStorage.setItem('userData', JSON.stringify(response.user));
                setUser(response.user);
            } else {
                const userData = { username };
                localStorage.setItem('userData', JSON.stringify(userData));
                setUser(userData);
            }

            if (response.role) {
                localStorage.setItem('permissao', response.role);
                setPermissao(response.role);
            }

            return { success: true, data: response };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };
    const logout = () => {
        sessionUtils.clearSession();
        setUser(null);
    };

    const isAuthenticated = sessionUtils.isSessionValid();

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            error,
            login,
            logout,
            isAuthenticated,
            setError,
            sessionUtils,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};