
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
// import './ModalAlterarSenha.css';

export default function ModalAlterarSenha({ isOpen, onClose }) {
    const { alterarSenha, alterandoSenha } = useAuth();
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem({ texto: '', tipo: '' });

        if (!senhaAtual || !novaSenha || !confirmarSenha) {
            setMensagem({ texto: 'Todos os campos são obrigatórios', tipo: 'erro' });
            return;
        }

        if (novaSenha.length < 6) {
            setMensagem({ texto: 'A nova senha deve ter pelo menos 6 caracteres', tipo: 'erro' });
            return;
        }

        if (novaSenha !== confirmarSenha) {
            setMensagem({ texto: 'As senhas não coincidem', tipo: 'erro' });
            return;
        }

        const result = await alterarSenha(senhaAtual, novaSenha);

        if (result.success) {
            setMensagem({ texto: 'Senha alterada com sucesso!', tipo: 'sucesso' });
            setSenhaAtual('');
            setNovaSenha('');
            setConfirmarSenha('')
            setTimeout(() => {
                onClose();
            }, 2000);
        } else {

            if (result.error.includes('senha atual')) {
                setMensagem({ texto: 'Senha atual incorreta. Tente novamente.', tipo: 'erro' });
            } else {
                setMensagem({ texto: `Erro: ${result.error}`, tipo: 'erro' });
            }
        }
    };

    const handleClose = () => {
        setSenhaAtual('');
        setNovaSenha('');
        setConfirmarSenha('');
        setMensagem({ texto: '', tipo: '' });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className='modalNovaSenhaBackground' onClick={handleClose}>
            <div className='modalNovaSenhaJanela' onClick={(e) => e.stopPropagation()}>
                <h1>Alterar senha</h1>
                <p>Escolha a sua nova senha</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="Senha atual"
                        value={senhaAtual}
                        onChange={(e) => setSenhaAtual(e.target.value)}
                        disabled={alterandoSenha}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Nova senha (mínimo 6 caracteres)"
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        disabled={alterandoSenha}
                        required
                        minLength="6"
                    />
                    <input
                        type="password"
                        placeholder="Confirmar nova senha"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        disabled={alterandoSenha}
                        required
                    />

                    {mensagem.texto && (
                        <p className={`mensagem-senha ${mensagem.tipo}`}>
                            {mensagem.texto}
                        </p>
                    )}

                    <div className='botoes-modal-senha'>
                        <button
                            type="submit"
                            disabled={alterandoSenha}
                            className="btn-confirmar"
                        >
                            {alterandoSenha ? 'Alterando...' : 'Confirmar'}
                        </button>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="btn-cancelar"
                            disabled={alterandoSenha}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}