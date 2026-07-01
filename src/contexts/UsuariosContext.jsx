import React, { createContext, useState, useContext, useCallback } from 'react';
import { api } from '../Services/api';

const UsuariosContext = createContext();

export const UsuariosProvider = ({ children }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [usuarioEditando, setUsuarioEditando] = useState(null);

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

    const cadastrarUsuario = useCallback(async (dados) => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.post('/usuarios/', dados);
            setUsuarios(prev => [...prev, data]);
            return { success: true, data };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    }, []);

    const buscarUsuarioPorId = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.get(`/usuarios/${id}/`);
            setUsuarioEditando(data);
            return { success: true, data };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    }, []);


    const atualizarUsuario = useCallback(async (id, dados) => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.patch(`/usuarios/${id}/`, dados);
            setUsuarios(prev =>
                prev.map(u => u.id === id ? { ...u, ...dados } : u)
            );
            setUsuarioEditando(null);
            return { success: true, data };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    }, []);


    const deletarUsuario = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            await api.delete(`/usuarios/${id}/`);
            setUsuarios(prev => prev.filter(u => u.id !== id));
            return { success: true };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    }, [])

    const limparSelecao = useCallback(() => {
        setUsuarioEditando(null);
    }, []);

    return (
        <UsuariosContext.Provider value={{
            usuarios,
            loading,
            error,
            usuarioEditando,
            listarUsuarios,
            cadastrarUsuario,
            buscarUsuarioPorId,
            atualizarUsuario,
            deletarUsuario,
            limparSelecao,
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