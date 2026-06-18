// Login.jsx
import './login.css'
import Logo from '../assets/SITREV LOGO.png'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Login({ setJanela, onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loading } = useAuth();

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                return;
            }
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, []);

    const handleLogin = async () => {
        setError('');

        if (!username || !password) {
            setError('Preencha todos os campos');
            return;
        }

        const result = await login(username, password);

        if (result.success) {
            console.log('Login realizado com sucesso!');

            if (onLoginSuccess) {
                onLoginSuccess();
            }

            if (setJanela) {
                setJanela(false);
            }
        } else {
            setError(result.error || 'Erro ao fazer login');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="modalLogin">
            <main className="janelaLogin">
                <section className='formularioLogin'>
                    <img src={Logo} className='logoLogin' alt="Logo SITREV" />
                    <h1>Login</h1>
                    <p>Para acessar o sistema, você precisa estar logado. Dúvidas ou problemas? <a href="#">entre em contato conosco</a> </p>

                    {error && <div className="erroLogin">{error}</div>}

                    <span className='spanInpus'>
                        <p>Usuário</p>
                        <input
                            type="text"
                            className='pMenor'
                            placeholder='seu_usuario'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={handleKeyPress}
                            autoFocus
                            required
                        />
                        <p>Senha</p>
                        <input
                            type="password"
                            placeholder='**********'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handleKeyPress}
                            required
                        />
                    </span>
                    <a href="#">esqueci a senha</a>
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                    <p>Atenção: mantenha a confidencialidade desses dados!</p>
                </section>
                <section className='imagemDecorativa'>
                    <span className='textoApresentacao'>
                        <h1>Bem Vindo</h1>
                        <p>O SITREV foi desenvolvido para tornar o controle da sua frota mais simples, eficiente e seguro.
                            Aqui você pode acompanhar veículos em tempo real, registros de rotas, gerenciar motoristas e outras funcionalidades.
                        </p>
                        <h3>Faça login para continuar</h3>
                    </span>
                </section>
            </main>
        </div>
    )
}