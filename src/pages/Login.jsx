import './login.css'
import Logo from '../assets/SITREV LOGO.png'

export default function Login({ setJanela }) {
    return (
        <>
            <main className="janelaLogin">
                <section className='formularioLogin'>
                    <img src={Logo} className='logoLogin' alt="" />
                    <h1>Login</h1>
                    <p>Apenas funcionários autorizados podem acessar o sistema. Dúvidas ou problemas? <a href="#">entre em contato conosco</a> </p>
                    <span className='spanInpus'>
                        <p>Emaill</p>
                        <input type="email" name="" id="" className='pMenor' placeholder='seuemail@gmail.com' />
                        <p>Senha</p>
                        <input type="password" name="" id="" placeholder='**********' />
                    </span>
                    <a href="#" re>esqueci a senha</a>
                    <button onClick={() => setJanela(false)}>Entrar</button>
                    <p>Antenção: mantenha a confidencialidade desses dados!</p>
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
        </>
    )
}