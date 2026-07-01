import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import { BrowserRouter } from 'react-router-dom'

import { AuthProvider } from './contexts/AuthContext.jsx'
import { MotoristasProvider } from './contexts/MotoristasContext.jsx'
import { VeiculosProvider } from './contexts/VeiculosContext.jsx'
import { ViagensProvider } from './contexts/ViagensContext.jsx'
import { UsuariosProvider } from './contexts/UsuariosContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <MotoristasProvider>
        <VeiculosProvider>
          <ViagensProvider>
            <UsuariosProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </UsuariosProvider>
          </ViagensProvider>
        </VeiculosProvider>
      </MotoristasProvider>
    </AuthProvider>
  </StrictMode>,
)
