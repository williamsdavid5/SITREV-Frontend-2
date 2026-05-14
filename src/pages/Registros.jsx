import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from "react"
import './registros.css'

import Mapa from "./components/Mapa";
import { vehicleIcon, pontoPercursoIcon, starPercursotIcon, alertIcon, iconeNumero } from './components/Icones';
import PopupInfo from './components/PopupInfo';

import viajensLimpo from '../data/listaViagens';
import viajens from "../data/rastreamento";

import { formatarDataHora } from "../utils/functions";

export default function Registros() {
    const [viajensLista, setViagensLista] = useState();
    const [viagemTeste, setViagemTeste] = useState();

    useEffect(() => {
        document.title = "SITREV - Registros";
        setViagensLista(viajensLimpo);
        setViagemTeste(viajens[3]);
    }, [])

    const [tipoPesquisa, setTipoPesquisa] = useState(1);

    const [menuLateral, setMenuLateral] = useState(true);
    const [itemSelecionado, setItemSelecionado] = useState(0);

    return (
        <>
            <main className="registrosMain">
                {!menuLateral && (
                    <button
                        className="botaoExibirJanela"
                        onClick={() => setMenuLateral(!menuLateral)}
                    >
                        ➜
                    </button>
                )}
                <aside className={`esquerdaJanela esquerdaRegistros ${menuLateral && 'ativo'}`}>
                    <div className="topoJanela">
                        <span style={{ width: '100%', justifyContent: 'space-between', display: 'flex' }}>
                            <span>
                                <h2>Registros</h2>
                                <p className="pMenor">
                                    Reconstrua todos os registros armazenados no sistema
                                </p>
                            </span>
                            <button
                                className="botaoFecharJanelaLateral"
                                onClick={() => setMenuLateral(!menuLateral)}>
                                Fechar
                            </button>
                        </span>
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
                        {viajensLista?.map((viagem, index) => {
                            return (
                                <div className="itemViagemLista" key={index} onClick={() => {
                                    setItemSelecionado(viagem.id);
                                }}>
                                    <p>
                                        <b>Veículo:</b> {viagem.modelo_veiculo} ({viagem.identificador_veiculo}) <br />
                                        <b>Motorista: </b> {viagem.nome_motorista} <br />
                                        <b>Ultimo registro: </b> {formatarDataHora(viagem.ultimo_registro)}
                                    </p>
                                    {itemSelecionado == viagem.id && (
                                        <button
                                            className="botaoExibirPercurso"
                                            onClick={() => setMenuLateral(false)}
                                        >Exibir percurso</button>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </aside>
                <section className="direitajanela">
                    <Mapa>
                        {viagemTeste && itemSelecionado && (() => {
                            const registros = viagemTeste.registros;
                            const ultimoRegistro = registros[registros.length - 1];
                            const rotaCoordenadas = registros.map(reg => [
                                parseFloat(reg.latitude),
                                parseFloat(reg.longitude)
                            ]);
                            const posicaoVeiculo = [
                                parseFloat(ultimoRegistro.latitude),
                                parseFloat(ultimoRegistro.longitude)
                            ];

                            return (
                                <>
                                    <Polyline
                                        positions={rotaCoordenadas}
                                        pathOptions={{
                                            color: 'var(--destaque1)',
                                            dashArray: '0, 0',
                                            weight: 3
                                        }}
                                    />

                                    {registros.slice(0, -1).map((reg, index) => {
                                        const isFirst = index === 0;
                                        const iconeNumerado = iconeNumero(index + 1);

                                        return (
                                            <Marker
                                                key={reg.id}
                                                position={[parseFloat(reg.latitude), parseFloat(reg.longitude)]}
                                                icon={isFirst ? starPercursotIcon : iconeNumerado}
                                            >
                                                <Popup>
                                                    <PopupInfo
                                                        tipo={isFirst ? 'inicio' : 'ponto'}
                                                        viagem={viagemTeste}
                                                        pontoNumero={index + 1}
                                                        posicaoVeiculo={posicaoVeiculo}
                                                    />
                                                </Popup>
                                            </Marker>
                                        );
                                    })}

                                    <Marker
                                        position={posicaoVeiculo}
                                        icon={vehicleIcon}
                                    >
                                        <Popup>
                                            <PopupInfo
                                                tipo="veiculo"
                                                viagem={viagemTeste}
                                                posicaoVeiculo={posicaoVeiculo}
                                            />
                                        </Popup>
                                    </Marker>
                                </>
                            );
                        })()}
                    </Mapa>
                </section>
            </main>
        </>
    )
}