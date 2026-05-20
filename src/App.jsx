import { useState } from 'react'

import './App.css'

import { Routes, Route, NavLink } from 'react-router-dom'
import Login from './pages/Login';
import Inicio from './pages/Inicio';
import Registros from './pages/Registros';
import Veiculos from './pages/Veiculos';
import Motoristas from './pages/Motoristas';

import PaginaErro from './pages/PaginaErro';
import SitrevLogo from './assets/SITREV_TEXT.svg'

function App() {

  const [menuAberto, setMenuAberto] = useState(false);
  const [janelaLogin, setJanelaLogin] = useState(false);
  const [logado, setLogado] = useState(true);
  const [dadoUsuario, setDadosUsuario] = useState({ nomeUsuario: 'davidduart', email: 'davidduart04@gmail.com' });

  return (
    <>
      <header className='headerr'>
        <button className="botaoMenuLateral" onClick={() => setMenuAberto(!menuAberto)}>
          {menuAberto ? '✕' : '☰'}
        </button>
        <nav
          className={`menuSuperior ${menuAberto ? 'aberto' : ''}`}
        >
          <button className='botaoLogin' onClick={() => setJanelaLogin(true)}>
            {logado ?
              <span>
                <b>{dadoUsuario.nomeUsuario}</b> <br />
                <p className='pEmail'>{dadoUsuario.email}</p>
              </span>
              : 'Login'}
          </button>
          <NavLink to="/" end className={'primeiroLink'} onClick={() => setMenuAberto(false)}>Início</NavLink>
          <NavLink to="/registros" onClick={() => setMenuAberto(false)}>Registros</NavLink>
          <NavLink to="/veiculos" onClick={() => setMenuAberto(false)}>Veículos</NavLink>
          <NavLink to="/motoristas" onClick={() => setMenuAberto(false)}>Motoristas</NavLink>
        </nav>
        <img src={SitrevLogo} alt="" />
      </header>

      <main className='mainPrincipal'>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/registros" element={<Registros />} />
          <Route path="/veiculos" element={<Veiculos />} />
          <Route path="/motoristas" element={<Motoristas />} />

          {/* Rota de fallback (404)*/}
          <Route path="*" element={<PaginaErro />} />
        </Routes>
      </main>

      {janelaLogin && <>
        <Login
          setJanela={setJanelaLogin}
        ></Login>
      </>}
    </>
  )
}

export default App
