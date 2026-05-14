import { useEffect, useState } from "react"
import './registros.css'

import Mapa from "./components/Mapa";

import viajensLimpo from '../data/listaViagens';

import { formatarDataHora } from "../utils/functions";

export default function Registros() {
    const [viajens, setViagens] = useState([]);

    useEffect(() => {
        document.title = "SITREV - Registros";
        setViagens(viajensLimpo);
    }, [])

    const [tipoPesquisa, setTipoPesquisa] = useState(1);

    return (
        <>
            <main className="registrosMain">
                <aside className="esquerdaJanela esquerdaRegistros">
                    <div className="topoJanela">
                        <h2>Registros</h2>
                        <p className="pMenor">
                            Reconstrua todos os registros armazenados no sistema
                        </p>
                        {tipoPesquisa == 1 ?
                            <>
                                <input type="text" placeholder="Pesquise qualquer coisa" />
                            </> : <>
                                <div className="inputsPeriodo">
                                    <input type="text" name="" id="" placeholder="DD/MM/AAAA" />
                                    <p className="">a</p>
                                    <input type="text" name="" id="" placeholder="DD/MM/AAAA" />
                                </div>
                            </>
                        }
                        <p className="pMenor">Tipo de filtragem</p>
                        <div className="inputsPeriodo">
                            <select name="tipoPesquisa" id="tipoPesquisaInput" value={tipoPesquisa} onChange={(e) => setTipoPesquisa(e.target.value)}>
                                <option value="1">Barra de pesquisa</option>
                                <option value="2">Período</option>
                            </select>
                            <button>Limpar filtros</button>
                        </div>
                    </div>
                    <div className="listaJanela">
                        {viajens.map((viagem, index) => {
                            return (
                                <div className="itemViagemLista" key={index}>
                                    <p>
                                        <b>Veículo:</b> {viagem.modelo_veiculo} ({viagem.identificador_veiculo}) <br />
                                        <b>Motorista: </b> {viagem.nome_motorista} <br />
                                        <b>Ultimo registro: </b> {formatarDataHora(viagem.ultimo_registro)}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </aside>
                <section className="direitajanela">
                    <Mapa>

                    </Mapa>
                </section>
            </main>
        </>
    )
}