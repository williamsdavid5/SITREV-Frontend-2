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
    const [dadosRota, setDadosRota] = useState(null);

    const [tipoPesquisa, setTipoPesquisa] = useState(1);

    const [menuLateral, setMenuLateral] = useState(true);
    const [itemSelecionado, setItemSelecionado] = useState(0);

    useEffect(() => {
        document.title = "SITREV - Registros";
        setViagensLista(viajensLimpo);
        setViagemTeste(viajens[3]);
    }, [])

    //quando um item é selecionado, a rota é definida no estado para que o mapa possa renderizar o polyline
    useEffect(() => {
        if (viagemTeste && itemSelecionado != 0) {
            const rotaCoordenadas = viagemTeste.registros.map(reg => [
                parseFloat(reg.latitude),
                parseFloat(reg.longitude)
            ]);

            setDadosRota(rotaCoordenadas);
        }
    }, [itemSelecionado, viagemTeste])

    return (
        <>
            <main className="registrosMain">
                {!menuLateral && (
                    <button
                        className="botaoExibirJanela"
                        onClick={() => setMenuLateral(!menuLateral)}
                    >
                        ❯
                    </button>
                )}
                <aside className={`esquerdaJanela esquerdaRegistros ${menuLateral && 'ativo'}`}>
                    <section className="topoJanela">
                        <span className='espacoEntre'>
                            <span>
                                <h2>Registros</h2>
                                <p className="pMenor">
                                    Reconstrua todos os registros armazenados no sistema
                                </p>
                            </span>
                            <button
                                className="botaoFecharJanelaLateral"
                                onClick={() => setMenuLateral(!menuLateral)}>
                                ❮
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
                    </section>
                    <section className="listaJanela">
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
                    </section>
                </aside>
                <section className="direitajanela">
                    <Mapa dadosRota={dadosRota}>
                        {viagemTeste && itemSelecionado && (() => {
                            const registros = viagemTeste.registros;
                            const ultimoRegistro = registros[registros.length - 1];

                            const posicaoVeiculo = [
                                parseFloat(ultimoRegistro.latitude),
                                parseFloat(ultimoRegistro.longitude)
                            ];

                            return (
                                <>
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