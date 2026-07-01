// Usuarios.jsx
import { useEffect } from 'react';
import { useUsuarios } from '../contexts/UsuariosContext';
import './usuarios.css';

export default function Usuarios() {
    const { usuarios, loading, error, listarUsuarios } = useUsuarios();

    useEffect(() => {
        listarUsuarios();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Função para formatar o tipo de usuário
    const getTipoUsuario = (isSuperuser) => {
        return isSuperuser ? 'Administrador' : 'Operador';
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

    if (error) {
        return (
            <main className='mainMotoristas'>
                <section className='topoMotoristas topoUsuarios'>
                    <span>
                        <h1>Usuários</h1>
                        <p style={{ color: 'red' }}>Erro ao carregar usuários: {error}</p>
                    </span>
                    <button onClick={() => listarUsuarios()}>Tentar novamente</button>
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
                    <button>Cadastrar novo</button>
                </section>

                <section className='blocosMotoristas blocosUsuarios'>
                    {/* Formulário de novo usuário (mantido do layout original) */}
                    <div className='bloco blocoUsuario blocoNovoUsuario'>
                        <h2>Novo usuário</h2>
                        <input type="text" placeholder='Nome de usuário' />
                        <input type="text" name="" id="" placeholder='Senha' />
                        <label htmlFor="">
                            <input type="checkbox" /> Ativo
                            <input type="checkbox" /> Administrador
                        </label>
                        <p className='pMenor'>Em vez de excluir um usuário, ele pode ser ativado ou desativado</p>
                        <span>
                            <button>Salvar</button>
                            <button>Cancelar</button>
                        </span>
                    </div>

                    {/* Lista de usuários vindos da API */}
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
                                <button>Editar</button>
                            </div>
                        ))
                    )}
                </section>
            </main>
        </>
    );
}