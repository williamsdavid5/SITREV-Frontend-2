
import React, { createContext, useState, useContext, useCallback } from 'react';
import { api } from '../Services/api';

const VeiculosContext = createContext();

export const VeiculosProvider = ({ children }) => {
    const [veiculos, setVeiculos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viagensVeiculo, setViagensVeiculo] = useState([]);
    const [loadingViagens, setLoadingViagens] = useState(false);
    const [veiculoSelecionado, setVeiculoSelecionado] = useState(null);

    const listarVeiculos = useCallback(async (search = '') => {
        setLoading(true);
        setError(null);
        try {
            const endpoint = search
                ? `/veiculos/?search=${encodeURIComponent(search)}`
                : '/veiculos/';

            const data = await api.get(endpoint);
            setVeiculos(data);
            return { success: true, data };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    }, []);


    const buscarVeiculos = useCallback(async (termo) => {
        setSearchTerm(termo);
        return await listarVeiculos(termo);
    }, [listarVeiculos]);

    const recarregar = useCallback(async () => {
        return await listarVeiculos(searchTerm);
    }, [listarVeiculos, searchTerm]);

    const buscarViagensVeiculo = useCallback(async (veiculoId) => {
        setLoadingViagens(true);
        setError(null);
        try {
            const data = await api.get(`/veiculos/${veiculoId}/viagens/`);
            setViagensVeiculo(data);
            return { success: true, data };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setLoadingViagens(false);
        }
    }, []);

    const selecionarVeiculo = useCallback(async (veiculo) => {
        setVeiculoSelecionado(veiculo);
        if (veiculo && veiculo.id) {
            await buscarViagensVeiculo(veiculo.id);
        } else {
            setViagensVeiculo([]);
        }
    }, [buscarViagensVeiculo]);

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

    const limparSelecao = useCallback(() => {
        setVeiculoSelecionado(null);
        setViagensVeiculo([]);
    }, []);

    return (
        <VeiculosContext.Provider value={{
            veiculos,
            loading,
            error,
            searchTerm,
            viagensVeiculo,
            loadingViagens,
            veiculoSelecionado,
            listarVeiculos,
            buscarVeiculos,
            recarregar,
            buscarViagensVeiculo,
            selecionarVeiculo,
            processarRastroGPS,
            limparSelecao,
            setError,
        }}>
            {children}
        </VeiculosContext.Provider>
    );
};

export const useVeiculos = () => {
    const context = useContext(VeiculosContext);
    if (!context) {
        throw new Error('useVeiculos deve ser usado dentro de um VeiculosProvider');
    }
    return context;
};