// Usuarios.jsx
import { useState, useEffect } from 'react';
import { useUsuarios } from '../contexts/UsuariosContext';
import './usuarios.css';

export default function Usuarios() {
    const {
        usuarios,
        loading,
        error,
        usuarioEditando,
        listarUsuarios,
        cadastrarUsuario,
        buscarUsuarioPorId,
        atualizarUsuario,
        deletarUsuario,
        limparSelecao
    } = useUsuarios();

    const [novoUsuario, setNovoUsuario] = useState({
        username: '',
        password: '',
        is_superuser: false
    });

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

    useEffect(() => {
        listarUsuarios();
    }, []);

    useEffect(() => {
        if (mensagem.texto) {
            const timer = setTimeout(() => {
                setMensagem({ texto: '', tipo: '' });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [mensagem]);

    const getTipoUsuario = (isSuperuser) => {
        return isSuperuser ? 'Administrador' : 'Operador';
    };

    const handleCadastrar = async (e) => {
        e.preventDefault();
        if (!novoUsuario.username || !novoUsuario.password) {
            setMensagem({ texto: 'Preencha todos os campos obrigatórios', tipo: 'erro' });
            return;
        }

        const result = await cadastrarUsuario(novoUsuario);
        if (result.success) {
            setMensagem({ texto: 'Usuário cadastrado com sucesso!', tipo: 'sucesso' });
            setNovoUsuario({ username: '', password: '', is_superuser: false });
            setMostrarFormulario(false);
        } else {
            setMensagem({ texto: `Erro: ${result.error}`, tipo: 'erro' });
        }
    };

    const handleEditar = async (id) => {
        const result = await buscarUsuarioPorId(id);
        if (result.success) {
            setModoEdicao(true);
            setMostrarFormulario(true);
        } else {
            setMensagem({ texto: `Erro ao carregar usuário: ${result.error}`, tipo: 'erro' });
        }
    };
    const handleAtualizar = async (e) => {
        e.preventDefault();
        if (!usuarioEditando) return;

        const dados = {
            is_superuser: usuarioEditando.is_superuser
        };

        const result = await atualizarUsuario(usuarioEditando.id, dados);
        if (result.success) {
            setMensagem({ texto: 'Usuário atualizado com sucesso!', tipo: 'sucesso' });
            setModoEdicao(false);
            setMostrarFormulario(false);
            limparSelecao();
        } else {
            setMensagem({ texto: `Erro: ${result.error}`, tipo: 'erro' });
        }
    };

    const handleDeletar = async (id, username) => {
        if (!window.confirm(`Tem certeza que deseja deletar o usuário "${username}"?`)) return;

        const result = await deletarUsuario(id);
        if (result.success) {
            setMensagem({ texto: 'Usuário deletado com sucesso!', tipo: 'sucesso' });
        } else {
            setMensagem({ texto: `Erro: ${result.error}`, tipo: 'erro' });
        }
    };

    const handleCancelar = () => {
        setMostrarFormulario(false);
        setModoEdicao(false);
        limparSelecao();
        setNovoUsuario({ username: '', password: '', is_superuser: false });
    };

    if (loading && usuarios.length === 0) {
        return (
            <main className='mainMotoristas'>
                <section className='topoMotoristas topoUsuarios'>
                    <span>
                        <h1>Usuários</h1>
                        <p>Carregando usuários...</p>
                    </span>
                    <button>Cadastrar novo</button>
                </section>
            </main>
        );
    }

    return (
        <>
            <main className='mainMotoristas'>
                <section className='topoMotoristas topoUsuarios'>
                    <span>
                        <h1>Usuários</h1>
                        <p>Todos os usuários cadastrados no sistema.</p>
                    </span>
                    <button
                        onClick={() => {
                            if (mostrarFormulario) {
                                handleCancelar();
                            } else {
                                setMostrarFormulario(true);
                                setModoEdicao(false);
                                setNovoUsuario({ username: '', password: '', is_superuser: false });
                            }
                        }}
                    >
                        {mostrarFormulario ? 'Cancelar' : 'Cadastrar novo'}
                    </button>
                </section>

                {mensagem.texto && (
                    <div className={`mensagem ${mensagem.tipo}`}>
                        {mensagem.texto}
                    </div>
                )}

                <section className='blocosMotoristas blocosUsuarios'>
                    {mostrarFormulario && (
                        <div className='bloco blocoUsuario blocoNovoUsuario'>
                            <h2>{modoEdicao ? 'Editar usuário' : 'Novo usuário'}</h2>
                            <form onSubmit={modoEdicao ? handleAtualizar : handleCadastrar}>
                                <input
                                    type="text"
                                    placeholder='Nome de usuário'
                                    value={modoEdicao ? usuarioEditando?.username || '' : novoUsuario.username}
                                    onChange={(e) => {
                                        if (modoEdicao) {
                                            setUsuarioEditando({ ...usuarioEditando, username: e.target.value });
                                        } else {
                                            setNovoUsuario({ ...novoUsuario, username: e.target.value });
                                        }
                                    }}
                                    disabled={modoEdicao}
                                    required
                                />
                                {!modoEdicao && (
                                    <input
                                        type="password"
                                        placeholder='Senha'
                                        value={novoUsuario.password}
                                        onChange={(e) => setNovoUsuario({ ...novoUsuario, password: e.target.value })}
                                        required
                                    />
                                )}
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={modoEdicao ? usuarioEditando?.is_superuser || false : novoUsuario.is_superuser}
                                        onChange={(e) => {
                                            if (modoEdicao) {
                                                setUsuarioEditando({ ...usuarioEditando, is_superuser: e.target.checked });
                                            } else {
                                                setNovoUsuario({ ...novoUsuario, is_superuser: e.target.checked });
                                            }
                                        }}
                                    />
                                    Administrador
                                </label>
                                <p className='pMenor'>
                                    {modoEdicao
                                        ? 'Altere o tipo de permissão do usuário'
                                        : 'Usuários administradores têm acesso total ao sistema'}
                                </p>
                                <span>
                                    <button type="submit" disabled={loading}>
                                        {modoEdicao ? 'Atualizar' : 'Salvar'}
                                    </button>
                                    <button type="button" onClick={handleCancelar}>
                                        Cancelar
                                    </button>
                                </span>
                            </form>
                        </div>
                    )}
                    {usuarios.length === 0 ? (
                        <div className='bloco blocoUsuario'>
                            <p>Nenhum usuário cadastrado.</p>
                        </div>
                    ) : (
                        usuarios.map((usuario) => (
                            <div key={usuario.id} className='bloco blocoUsuario'>
                                <h3>Usuário: {usuario.username}</h3>
                                <p><b>Tipo:</b> {getTipoUsuario(usuario.is_superuser)}</p>
                                <hr />
                                <button onClick={() => handleEditar(usuario.id)}>Editar</button>
                                <button
                                    onClick={() => handleDeletar(usuario.id, usuario.username)}
                                    className='botaoDeletar'
                                >
                                    Deletar
                                </button>
                            </div>
                        ))
                    )}
                </section>
            </main>
        </>
    );
}