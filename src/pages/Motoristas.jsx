
import { useEffect, useState } from "react";
import './motoristas.css'
import FotoMotorista from '../assets/motoristaFoto.png'
import { formatarDataHora } from "../utils/functions";
import { useMotoristas } from "../contexts/MotoristasContext";

import LoadingGif from '../assets/loadingGif.gif'

export default function Motoristas() {
    useEffect(() => {
        document.title = "SITREV - Motoristas";
    }, [])

    const {
        motoristas,
        loading,
        error,
        buscarMotoristas,
        recarregar,
        searchTerm,
        atualizarMotorista,
        deletarMotorista,
        adicionarMotorista
    } = useMotoristas();

    useEffect(() => {
        recarregar();
    }, []);

    const [itemSelecionado, setItemSelecionado] = useState({ id: 0 });
    const [buscaLocal, setBuscaLocal] = useState('');

    const [permissao, setPermissao] = useState(localStorage.getItem("permissao"));
    const [adicionandoNovo, setAdicionandoNovo] = useState(false);

    const [editandoId, setEditandoId] = useState(null);
    const [nomeEditando, setNomeEditando] = useState('');
    const [salvandoEdicao, setSalvandoEdicao] = useState(false);

    const [novoNome, setNovoNome] = useState('');
    const [salvandoNovo, setSalvandoNovo] = useState(false);
    const [erroForm, setErroForm] = useState('');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (buscaLocal !== searchTerm) {
                buscarMotoristas(buscaLocal);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [buscaLocal, buscarMotoristas, searchTerm]);

    useEffect(() => {
        const handleStorageChange = () => {
            setPermissao(localStorage.getItem("permissao"));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleAdicionarMotorista = async (e) => {
        e.preventDefault();
        setErroForm('');

        if (!novoNome.trim()) {
            setErroForm('O nome do motorista é obrigatório');
            return;
        }

        setSalvandoNovo(true);
        try {
            const result = await adicionarMotorista({ nome: novoNome.trim() });

            if (result.success) {
                setAdicionandoNovo(false);
                setNovoNome('');
                setErroForm('');
                alert('Motorista adicionado com sucesso!');
                await recarregar();
            } else {
                setErroForm(result.error || 'Erro ao adicionar motorista');
            }
        } catch (err) {
            setErroForm('Erro ao adicionar motorista');
            console.error(err);
        } finally {
            setSalvandoNovo(false);
        }
    };

    const handleEditarMotorista = (motorista) => {
        setEditandoId(motorista.id);
        setNomeEditando(motorista.nome);
    };

    const handleSalvarEdicao = async (id) => {
        if (!nomeEditando.trim()) {
            alert('O nome não pode estar vazio');
            return;
        }

        setSalvandoEdicao(true);
        try {
            const result = await atualizarMotorista(id, { nome: nomeEditando.trim() });
            if (result.success) {
                setEditandoId(null);
                setNomeEditando('');
                alert('Motorista atualizado com sucesso!');
            } else {
                alert(result.error || 'Erro ao atualizar motorista');
            }
        } catch (err) {
            alert('Erro ao atualizar motorista');
        } finally {
            setSalvandoEdicao(false);
        }
    };

    const handleDeletarMotorista = async (motorista) => {
        if (!window.confirm(`Tem certeza que deseja excluir o motorista ${motorista.nome}?`)) {
            return;
        }

        const result = await deletarMotorista(motorista.id);
        if (result.success) {
            alert('Motorista excluído com sucesso!');
            if (itemSelecionado.id === motorista.id) {
                setItemSelecionado({ id: 0 });
            }
        } else {
            alert(result.error || 'Erro ao excluir motorista');
        }
    };

    const handleCancelarEdicao = () => {
        setEditandoId(null);
        setNomeEditando('');
    };

    const handleCancelarNovo = () => {
        setAdicionandoNovo(false);
        setNovoNome('');
        setErroForm('');
    };

    return (
        <>
            <main className="mainMotoristas">
                <section className="topoMotoristas">
                    <span className="espacoEntre auxTopoMotoristas">
                        <span>
                            <h1>Motoristas</h1>
                            <p>Todos os motoristas cadastrados no sistema</p>
                        </span>
                        <span style={{ display: 'flex', gap: '10px' }}>
                            {permissao === "administrador" && (
                                <button
                                    className="botaoNovoMotorista"
                                    onClick={() => setAdicionandoNovo(!adicionandoNovo)}
                                >
                                    {adicionandoNovo ? 'Fechar' : 'Novo motorista'}
                                </button>
                            )}
                            <input
                                type="text"
                                placeholder="Pesquisar por nome..."
                                className="inputPesquisaMotorista"
                                value={buscaLocal}
                                onChange={(e) => setBuscaLocal(e.target.value)}
                            />
                        </span>
                    </span>
                </section>
                <section className={`blocosMotoristas`}>
                    {loading ? (
                        <div className="loading-veiculos">
                            <img src={LoadingGif} alt="" />
                            Carregando motoristas...
                        </div>
                    ) : error ? (
                        <div className="error-motoristas">
                            <p>{error}</p>
                            <button onClick={() => recarregar()}>Tentar novamente</button>
                        </div>
                    ) : motoristas.length === 0 ? (
                        <div className="vazio-motoristas">
                            <p>Nenhum motorista encontrado.</p>
                            {searchTerm && <p>Tente buscar por outro nome.</p>}
                        </div>
                    ) : (
                        <>
                            {adicionandoNovo && permissao === "administrador" && (
                                <form onSubmit={handleAdicionarMotorista} className="bloco blocoNovoMotorista">
                                    <h3>Cadastrando novo motorista</h3>
                                    <hr />
                                    {erroForm && (
                                        <div className="erro-form">{erroForm}</div>
                                    )}
                                    <span style={{ width: '100%' }}>
                                        <p className="pMenor">Nome:*</p>
                                        <input
                                            type="text"
                                            placeholder="Nome do motorista"
                                            value={novoNome}
                                            onChange={(e) => setNovoNome(e.target.value)}
                                            disabled={salvandoNovo}
                                            required
                                            autoFocus
                                        />
                                    </span>
                                    <span className="spanBotoesNovo">
                                        <button type="submit" disabled={salvandoNovo}>
                                            {salvandoNovo ? 'Salvando...' : 'Salvar'}
                                        </button>
                                        <button type="button" onClick={handleCancelarNovo} disabled={salvandoNovo}>
                                            Cancelar
                                        </button>
                                    </span>
                                </form>
                            )}

                            {motoristas.map((motorista) => {
                                const isEditando = editandoId === motorista.id;
                                return (
                                    <div
                                        className={`bloco ${itemSelecionado.id == motorista.id && 'blocoSelecionado'}`}
                                        key={motorista.id}
                                        onClick={() => !isEditando && setItemSelecionado(motorista)}
                                    >
                                        <div className="esquerda">
                                            <img src={FotoMotorista} className="motoristaFoto" alt={`Foto ${motorista.nome}`} />
                                        </div>
                                        <div className="direita">
                                            {isEditando ? (
                                                <>
                                                    <h3>
                                                        <input
                                                            type="text"
                                                            value={nomeEditando}
                                                            onChange={(e) => setNomeEditando(e.target.value)}
                                                            style={{ fontSize: '16px', padding: '4px 8px', width: '80%' }}
                                                            disabled={salvandoEdicao}
                                                            autoFocus
                                                        />
                                                        <span style={{ fontSize: '14px', color: '#718096' }}> - ID {motorista.id}</span>
                                                    </h3>
                                                    <hr />
                                                    <span className="botoesItemMotorista">
                                                        <button onClick={() => handleSalvarEdicao(motorista.id)} disabled={salvandoEdicao}>
                                                            {salvandoEdicao ? 'Salvando...' : 'Salvar'}
                                                        </button>
                                                        <button onClick={handleCancelarEdicao} disabled={salvandoEdicao}>
                                                            Cancelar
                                                        </button>
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <h3><b>{motorista.nome} - ID {motorista.id}</b></h3>
                                                    <hr />
                                                    <p>
                                                        <b>Ultimo registro em:</b> {formatarDataHora(motorista.ultimo_registro)} <br />
                                                        <b>Ultimo veículo usado:</b> {motorista.ultimo_veiculo || 'Não informado'} <br />
                                                        {motorista.status === "Parado" ? (
                                                            <span className="destaqueGreen"><b>Parado</b></span>
                                                        ) : (
                                                            <span className="destaqueGold"><b>Em viagem</b></span>
                                                        )}
                                                    </p>
                                                    {permissao === "administrador" && (
                                                        <span className="botoesItemMotorista">
                                                            <button onClick={() => handleEditarMotorista(motorista)}>
                                                                Editar
                                                            </button>
                                                            <button
                                                                className="botaoExcluir"
                                                                onClick={() => handleDeletarMotorista(motorista)}
                                                            >
                                                                Excluir
                                                            </button>
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}
                </section>
            </main>
        </>
    )
}