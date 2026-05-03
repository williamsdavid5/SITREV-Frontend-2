import { useState } from 'react'

import './App.css'

import { Routes, Route, Link } from 'react-router-dom'
import Inicio from './pages/Inicio';
import Registros from './pages/Registros';

function App() {

  return (
    <>
      <header>
        <nav>
          <Link to="/">Início</Link>
          <Link to="/registros">Registros</Link>
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
