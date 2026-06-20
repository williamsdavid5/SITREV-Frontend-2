// contexts/MotoristasContext.jsx
import React, { createContext, useState, useContext, useCallback } from 'react';
import { api } from '../Services/api';

const MotoristasContext = createContext();

export const MotoristasProvider = ({ children }) => {
    const [motoristas, setMotoristas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Lista todos os motoristas (com filtro opcional)
    const listarMotoristas = useCallback(async (search = '') => {
        setLoading(true);
        setError(null);
        try {
            const endpoint = search
                ? `/motoristas/?search=${encodeURIComponent(search)}`
                : '/motoristas/';

            const data = await api.get(endpoint);
            setMotoristas(data);
            return { success: true, data };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    }, []);

    // Busca motoristas por nome (filtro em tempo real)
    const buscarMotoristas = useCallback(async (nome) => {
        setSearchTerm(nome);
        return await listarMotoristas(nome);
    }, [listarMotoristas]);

    // Recarrega a lista (sem filtro)
    const recarregar = useCallback(async () => {
        return await listarMotoristas(searchTerm);
    }, [listarMotoristas, searchTerm]);

    return (
        <MotoristasContext.Provider value={{
            motoristas,
            loading,
            error,
            searchTerm,
            listarMotoristas,
            buscarMotoristas,
            recarregar,
            setError,
        }}>
            {children}
        </MotoristasContext.Provider>
    );
};

export const useMotoristas = () => {
    const context = useContext(MotoristasContext);
    if (!context) {
        throw new Error('useMotoristas deve ser usado dentro de um MotoristasProvider');
    }
    return context;
};