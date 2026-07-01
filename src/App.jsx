// App.jsx
import { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Registros from './pages/Registros';
import Veiculos from './pages/Veiculos';
import Motoristas from './pages/Motoristas';
import Usuarios from './pages/Usuarios';
import PaginaErro from './pages/PaginaErro';
import SitrevLogo from './assets/SITREV_TEXT.svg';
import RotaProtegida from './pages/components/RotaProtegida';
import { sessionUtils } from './utils/sessionUtils';
import { useAuth } from './contexts/AuthContext';

function App() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [janelaLogin, setJanelaLogin] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, permissao, loading: authLoading } = useAuth();

  useEffect(() => {
    const events = ['click', 'keydown', 'scroll', 'mousemove', 'touchstart'];

    const handleActivity = () => {
      sessionUtils.updateActivity();
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, []);

  useEffect(() => {
    if (!authLoading) {
      setCarregando(false);
      if (!isAuthenticated) {
        setJanelaLogin(true);
      } else {
        setJanelaLogin(false);
      }
    }
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    if (location.state?.abrirLogin) {
      setJanelaLogin(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      if (sessionUtils.isSessionExpired()) {
        sessionUtils.clearSession();
        logout();
        setJanelaLogin(true);
        alert('Sessão expirada por inatividade. Faça login novamente.');
        navigate('/');
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, logout, navigate]);

  const handleLogout = () => {
    logout();
    setJanelaLogin(true);
    navigate('/');
  };

  const toggleLogin = () => {
    if (isAuthenticated) {
      handleLogout();
    } else {
      setJanelaLogin(true);
    }
  };

  const handleLoginSuccess = () => {
    setJanelaLogin(false);
  };

  if (carregando || authLoading) {
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
            {isAuthenticated ? (
              <span>
                <p>Usuário: <b>{user?.username || 'Usuário'}</b></p>
                <p className='p'>Clique para sair</p>
              </span>
            ) : (
              'Login'
            )}
          </button>
          <NavLink to="/" end className={'primeiroLink'} onClick={() => setMenuAberto(false)}>
            Registros
          </NavLink>
          <NavLink to="/veiculos" onClick={() => setMenuAberto(false)}>
            Veículos
          </NavLink>
          <NavLink to="/motoristas" onClick={() => setMenuAberto(false)}>
            Motoristas
          </NavLink>
          {permissao === 'administrador' && (
            <NavLink to="/usuarios" onClick={() => setMenuAberto(false)}>
              Usuários
            </NavLink>
          )}
        </nav>
        <img src={SitrevLogo} alt="SITREV" />
      </header>

      <main className='mainPrincipal'>
        <Routes>
          <Route path="/" element={
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
          <Route path="/usuarios" element={
            <RotaProtegida>
              <Usuarios />
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

      {!isAuthenticated && (
        <div className="overlayBloqueio" />
      )}
    </>
  );
}

export default App;