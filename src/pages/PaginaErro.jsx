import './paginaErro.css';
import Logo from '../assets/LogoPadraoCompleta.svg'

import { NavLink } from 'react-router-dom'

export default function PaginaErro() {
    return (
        <>
            <main className='mainErroPage'>
                <h1 className='roboto-bold'>404</h1>
                <h2>Erro: página não encontrada</h2>
                <p>Verifique o link que você acessou</p>
                <NavLink to="/" onClick={() => setMenuAberto(false)}>Voltar ao início</NavLink>
                <img src={Logo} alt="" />
            </main>
        </>
    )
}