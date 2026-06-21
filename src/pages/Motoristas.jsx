import { useEffect, useState } from "react";
import './motoristas.css'
import FotoMotorista from '../assets/motoristaFoto.png'
import { formatarDataHora } from "../utils/functions";
import { useMotoristas } from "../contexts/MotoristasContext";

import LoadingGif from '../assets/loadingGif.gif'

export default function Motoristas() {
    useEffect(() => {
        document.title = "SITREV - Motoristas";
    }, [])

    const {
        motoristas,
        loading,
        error,
        buscarMotoristas,
        recarregar,
        searchTerm
    } = useMotoristas();

    useEffect(() => {
        recarregar();
    }, []);

    const [itemSelecionado, setItemSelecionado] = useState({ id: 0 });
    const [buscaLocal, setBuscaLocal] = useState('');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (buscaLocal !== searchTerm) {
                buscarMotoristas(buscaLocal);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [buscaLocal, buscarMotoristas, searchTerm]);

    return (
        <>
            <main className="mainMotoristas">
                <section className="topoMotoristas">
                    <span className="espacoEntre auxTopoMotoristas">
                        <span>
                            <h1>Motoristas</h1>
                            <p>Todos os motoristas cadastrados no sistema</p>
                        </span>
                        <input
                            type="text"
                            placeholder="Pesquisar por nome..."
                            className="inputPesquisaMotorista"
                            value={buscaLocal}
                            onChange={(e) => setBuscaLocal(e.target.value)}
                        />
                    </span>
                </section>
                <section className={`blocosMotoristas`}>
                    {loading ? (
                        <div className="loading-veiculos">
                            <img src={LoadingGif} alt="" />
                            Carregando motoristas...
                        </div>
                    ) : error ? (
                        <div className="error-motoristas">
                            <p>{error}</p>
                            <button onClick={() => recarregar()}>Tentar novamente</button>
                        </div>
                    ) : motoristas.length === 0 ? (
                        <div className="vazio-motoristas">
                            <p>Nenhum motorista encontrado.</p>
                            {searchTerm && <p>Tente buscar por outro nome.</p>}
                        </div>
                    ) : (
                        motoristas.map((motorista) => (
                            <div
                                className={`bloco ${itemSelecionado.id == motorista.id && 'blocoSelecionado'}`}
                                key={motorista.id}
                                onClick={() => setItemSelecionado(motorista)}
                            >
                                <div className="esquerda">
                                    <img src={FotoMotorista} className="motoristaFoto" alt={`Foto ${motorista.nome}`} />
                                </div>
                                <div className="direita">
                                    <h3><b>{motorista.nome} - ID {motorista.id}</b></h3>
                                    <hr />
                                    <p>
                                        <b>Ultimo registro em:</b> {formatarDataHora(motorista.ultimo_registro)} <br />
                                        <b>Ultimo veículo usado:</b> {motorista.ultimo_veiculo} <br />
                                        {motorista.status === "Parado" ? (
                                            <span className="destaqueGreen"><b>Parado</b></span>
                                        ) : (
                                            <span className="destaqueGold"><b>Em viagem</b></span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </section>
            </main>
        </>
    )
}