import { useState } from 'react'

import './App.css'

import { Routes, Route, NavLink } from 'react-router-dom'
import Inicio from './pages/Inicio';
import Registros from './pages/Registros';
import Veiculos from './pages/Veiculos';
import Motoristas from './pages/Motoristas';

import PaginaErro from './pages/PaginaErro';
import SitrevLogo from './assets/SITREV_TEXT.svg'

function App() {

  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <>
      <header className='headerr'>
        <button className="botaoMenuLateral" onClick={() => setMenuAberto(!menuAberto)}>
          {menuAberto ? '✕' : '☰'}
        </button>
        <nav className={`menuSuperior ${menuAberto ? 'aberto' : ''}`}>
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
    </>
  )
}

export default App
