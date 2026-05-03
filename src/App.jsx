import { useState } from 'react'

import './App.css'

import { Routes, Route, NavLink } from 'react-router-dom'
import Inicio from './pages/Inicio';
import Registros from './pages/Registros';

function App() {

  return (
    <>
      <header>
        <nav className='menuSuperior'>
          <NavLink to="/" end className={'primeiroLink'}>Início</NavLink>
          <NavLink to="/registros">Registros</NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/registros" element={<Registros />} />

          {/* Rota de fallback (404)*/}
          <Route path="*" element={<h2>Página não encontrada</h2>} />
        </Routes>
      </main>
    </>
  )
}

export default App
