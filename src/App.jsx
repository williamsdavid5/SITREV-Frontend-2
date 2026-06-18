// App.jsx
import { useState, useEffect } from 'react'
import './App.css'
import { Routes, Route, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Login from './pages/Login';
import Inicio from './pages/Inicio';
import Registros from './pages/Registros';
import Veiculos from './pages/Veiculos';
import Motoristas from './pages/Motoristas';
import PaginaErro from './pages/PaginaErro';
import SitrevLogo from './assets/SITREV_TEXT.svg'
import RotaProtegida from './pages/components/RotaProtegida';

function App() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [janelaLogin, setJanelaLogin] = useState(false);
  const [logado, setLogado] = useState(false);
  const [dadoUsuario, setDadosUsuario] = useState({ nomeUsuario: '', email: '' });
  const [carregando, setCarregando] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      setLogado(true);
      setDadosUsuario({ nomeUsuario: JSON.parse(userData).username })
    } else {
      setLogado(false);
      setJanelaLogin(true);
    }

    setCarregando(false);

    if (location.state?.abrirLogin) {
      setJanelaLogin(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('userData');
    setLogado(false);
    setDadosUsuario({ nomeUsuario: '', email: '' });
    setJanelaLogin(true);
    navigate('/');
  };

  const toggleLogin = () => {
    if (logado) {
      handleLogout();
    } else {
      setJanelaLogin(true);
    }
  };

  const handleLoginSuccess = () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setDadosUsuario({ nomeUsuario: JSON.parse(userData).username });

      setLogado(true);
    }
    setJanelaLogin(false);
  };

  if (carregando) {
    return <div className="carregando">Carregando...</div>;
  }

  return (
    <>
      <header className='headerr'>
        <button className="botaoMenuLateral" onClick={() => setMenuAberto(!menuAberto)}>
          {menuAberto ? '✕' : '☰'}
        </button>
        <nav className={`menuSuperior ${menuAberto ? 'aberto' : ''}`}>
          <button className='botaoLogin' onClick={toggleLogin}>
            {logado ? (
              <span>
                <p>Usuário logado</p>
                <b>{dadoUsuario.nomeUsuario}</b> <br />
                <p className='p'></p>
              </span>
            ) : (
              'Login'
            )}
          </button>
          <NavLink to="/" end className={'primeiroLink'} onClick={() => setMenuAberto(false)}>
            Início
          </NavLink>
          <NavLink to="/registros" onClick={() => setMenuAberto(false)}>
            Registros
          </NavLink>
          <NavLink to="/veiculos" onClick={() => setMenuAberto(false)}>
            Veículos
          </NavLink>
          <NavLink to="/motoristas" onClick={() => setMenuAberto(false)}>
            Motoristas
          </NavLink>
        </nav>
        <img src={SitrevLogo} alt="SITREV" />
      </header>

      <main className='mainPrincipal'>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/registros" element={
            <RotaProtegida>
              <Registros />
            </RotaProtegida>
          } />
          <Route path="/veiculos" element={
            <RotaProtegida>
              <Veiculos />
            </RotaProtegida>
          } />
          <Route path="/motoristas" element={
            <RotaProtegida>
              <Motoristas />
            </RotaProtegida>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {janelaLogin && (
        <Login
          setJanela={setJanelaLogin}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {!logado && (
        <div className="overlayBloqueio" />
      )}
    </>
  )
}

export default App