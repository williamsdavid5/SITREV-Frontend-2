// contexts/UsuariosContext.jsx
import React, { createContext, useState, useContext, useCallback } from 'react';
import { api } from '../Services/api';

const UsuariosContext = createContext();

export const UsuariosProvider = ({ children }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Lista todos os usuários
    const listarUsuarios = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.get('/usuarios/');
            setUsuarios(data);
            return { success: true, data };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <UsuariosContext.Provider value={{
            usuarios,
            loading,
            error,
            listarUsuarios,
            setError,
        }}>
            {children}
        </UsuariosContext.Provider>
    );
};

export const useUsuarios = () => {
    const context = useContext(UsuariosContext);
    if (!context) {
        throw new Error('useUsuarios deve ser usado dentro de um UsuariosProvider');
    }
    return context;
};