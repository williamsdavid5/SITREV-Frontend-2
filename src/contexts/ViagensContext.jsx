// contexts/ViagensContext.jsx
import React, { createContext, useState, useContext, useCallback } from 'react';
import { api } from '../Services/api';

const ViagensContext = createContext();

export const ViagensProvider = ({ children }) => {
    const [viagens, setViagens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viagemSelecionada, setViagemSelecionada] = useState(null);

    // Lista todas as viagens
    const listarViagens = useCallback(async (search = '') => {
        setLoading(true);
        setError(null);
        try {
            const endpoint = search
                ? `/viagens/?search=${encodeURIComponent(search)}`
                : '/viagens/';

            const data = await api.get(endpoint);
            setViagens(data);
            return { success: true, data };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    }, []);

    // Busca viagens por termo
    const buscarViagens = useCallback(async (termo) => {
        setSearchTerm(termo);
        return await listarViagens(termo);
    }, [listarViagens]);

    // Recarrega a lista
    const recarregar = useCallback(async () => {
        return await listarViagens(searchTerm);
    }, [listarViagens, searchTerm]);

    // Seleciona uma viagem
    const selecionarViagem = useCallback((viagem) => {
        setViagemSelecionada(viagem);
    }, []);

    // Processa o rastro GPS da viagem
    const processarRastroGPS = useCallback((rastroGps) => {
        if (!rastroGps) return [];
        try {
            if (typeof rastroGps === 'string') {
                return JSON.parse(rastroGps);
            }
            if (Array.isArray(rastroGps)) {
                return rastroGps;
            }
            return [];
        } catch (e) {
            console.error('Erro ao processar rastro GPS:', e);
            return [];
        }
    }, []);

    // Limpa a seleção
    const limparSelecao = useCallback(() => {
        setViagemSelecionada(null);
    }, []);

    return (
        <ViagensContext.Provider value={{
            viagens,
            loading,
            error,
            searchTerm,
            viagemSelecionada,
            listarViagens,
            buscarViagens,
            recarregar,
            selecionarViagem,
            processarRastroGPS,
            limparSelecao,
            setError,
        }}>
            {children}
        </ViagensContext.Provider>
    );
};

export const useViagens = () => {
    const context = useContext(ViagensContext);
    if (!context) {
        throw new Error('useViagens deve ser usado dentro de um ViagensProvider');
    }
    return context;
};