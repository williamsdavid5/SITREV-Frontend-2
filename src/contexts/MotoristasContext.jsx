// contexts/MotoristasContext.jsx
import React, { createContext, useState, useContext, useCallback } from 'react';
import { api } from '../Services/api';

const MotoristasContext = createContext();

export const MotoristasProvider = ({ children }) => {
    const [motoristas, setMotoristas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [motoristaSelecionado, setMotoristaSelecionado] = useState(null);
    const [loadingDetalhes, setLoadingDetalhes] = useState(false);

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

    // 🔥 ADICIONA NOVO MOTORISTA (POST)
    const adicionarMotorista = useCallback(async (dados) => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.post('/motoristas/', dados);

            // Adiciona à lista local
            setMotoristas(prev => [...prev, data]);

            return { success: true, data };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    }, []);

    // Busca motorista por ID (GET)
    const buscarMotoristaPorId = useCallback(async (id) => {
        setLoadingDetalhes(true);
        setError(null);
        try {
            const data = await api.get(`/motoristas/${id}/`);
            setMotoristaSelecionado(data);
            return { success: true, data };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setLoadingDetalhes(false);
        }
    }, []);

    // Atualiza motorista (PATCH)
    const atualizarMotorista = useCallback(async (id, dados) => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.patch(`/motoristas/${id}/`, dados);

            // Atualiza na lista local
            setMotoristas(prev =>
                prev.map(m => m.id === id ? { ...m, ...dados } : m)
            );

            if (motoristaSelecionado?.id === id) {
                setMotoristaSelecionado({ ...motoristaSelecionado, ...dados });
            }

            return { success: true, data };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    }, [motoristaSelecionado]);

    // Deleta motorista (DELETE)
    const deletarMotorista = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            await api.delete(`/motoristas/${id}/`);

            setMotoristas(prev => prev.filter(m => m.id !== id));

            if (motoristaSelecionado?.id === id) {
                setMotoristaSelecionado(null);
            }

            return { success: true };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    }, [motoristaSelecionado]);

    // Limpa seleção
    const limparSelecao = useCallback(() => {
        setMotoristaSelecionado(null);
    }, []);

    return (
        <MotoristasContext.Provider value={{
            motoristas,
            loading,
            error,
            searchTerm,
            motoristaSelecionado,
            loadingDetalhes,
            listarMotoristas,
            buscarMotoristas,
            recarregar,
            adicionarMotorista,        // 🔥 NOVO
            buscarMotoristaPorId,
            atualizarMotorista,
            deletarMotorista,
            limparSelecao,
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