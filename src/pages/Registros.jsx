
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from "react"
import './registros.css'

import Mapa from "./components/Mapa";
import { vehicleIcon, pontoPercursoIcon, starPercursotIcon, alertIcon, iconeNumero } from './components/Icones';
import PopupInfo from './components/PopupInfo';
import LoadingGif from '../assets/loadingGif.gif'

import { formatarDataHora } from "../utils/functions";
import { useViagens } from '../contexts/ViagensContext';

export default function Registros() {
    const {
        viagens,
        loading,
        error,
        buscarViagens,
        recarregar,
        searchTerm,
        viagemSelecionada,
        selecionarViagem,
        processarRastroGPS,
        limparSelecao
    } = useViagens();

    const [buscaLocal, setBuscaLocal] = useState('');
    const [tipoPesquisa, setTipoPesquisa] = useState(1);
    const [menuLateral, setMenuLateral] = useState(true);
    const [itemSelecionado, setItemSelecionado] = useState(0);
    const [dadosRota, setDadosRota] = useState(null);

    useEffect(() => {
        document.title = "SITREV - Registros";
        recarregar();
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (buscaLocal !== searchTerm) {
                buscarViagens(buscaLocal);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [buscaLocal, buscarViagens, searchTerm]);

    useEffect(() => {
        if (itemSelecionado !== 0) {
            const viagem = viagens.find(v => v.id === itemSelecionado);
            if (viagem) {
                selecionarViagem(viagem);
                const coordenadas = processarRastroGPS(viagem.rastro_gps);
                if (coordenadas.length > 0) {
                    setDadosRota(coordenadas);
                } else {
                    setDadosRota(null);
                }
            }
        } else {
            limparSelecao();
            setDadosRota(null);
        }
    }, [itemSelecionado, viagens, selecionarViagem, processarRastroGPS, limparSelecao]);

    useEffect(() => {
        if (!menuLateral) {

        }
    }, [menuLateral]);

    const handleLimparFiltros = () => {
        setBuscaLocal('');
        setTipoPesquisa(1);
        recarregar();
    };

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
                        {/* {tipoPesquisa == 1 ? (
                            <input
                                type="text"
                                placeholder="Pesquisar por veículo, motorista ou placa..."
                                value={buscaLocal}
                                onChange={(e) => setBuscaLocal(e.target.value)}
                            />
                        ) : (
                            <div className="inputsPeriodo">
                                <input type="text" name="" id="" placeholder="DD/MM/AAAA" />
                                <p className="">a</p>
                                <input type="text" name="" id="" placeholder="DD/MM/AAAA" />
                            </div>
                        )}
                        <p className="pMenor">Tipo de filtragem</p>
                        <div className="inputsPeriodo">
                            <select
                                name="tipoPesquisa"
                                id="tipoPesquisaInput"
                                value={tipoPesquisa}
                                onChange={(e) => setTipoPesquisa(Number(e.target.value))}
                            >
                                <option value="1">Barra de pesquisa</option>
                                <option value="2">Período</option>
                            </select>
                            <button onClick={handleLimparFiltros}>Limpar filtros</button>
                        </div> */}
                        <input
                            type="text"
                            placeholder="Pesquisar por veículo, motorista ou placa..."
                            value={buscaLocal}
                            onChange={(e) => setBuscaLocal(e.target.value)}
                        />
                    </section>
                    <section className="listaJanela">
                        {loading ? (
                            <div className="loading-viagens">
                                <img src={LoadingGif} alt="" />
                                Carregando viagens...
                            </div>
                        ) : error ? (
                            <div className="error-viagens">
                                <p>{error}</p>
                                <button onClick={() => recarregar()}>Tentar novamente</button>
                            </div>
                        ) : viagens.length === 0 ? (
                            <div className="vazio-viagens">
                                <p>Nenhuma viagem encontrada.</p>
                                {searchTerm && <p>Tente buscar por outro termo.</p>}
                            </div>
                        ) : (
                            viagens.map((viagem) => {
                                const emAndamento = !viagem.fim_viagem;
                                const duracao = emAndamento
                                    ? 'Em andamento'
                                    : viagem.duracao
                                        ? `${viagem.duracao}h`
                                        : '--';

                                return (
                                    <div
                                        className={`itemViagemLista ${itemSelecionado === viagem.id && 'itemAtivo'}`}
                                        key={viagem.id}
                                        onClick={() => {
                                            setItemSelecionado(viagem.id);
                                        }}
                                    >
                                        <p>
                                            <b>Veículo:</b> {viagem.veiculo_modelo} ({viagem.veiculo_placa}) <br />
                                            <b>Motorista:</b> {viagem.motorista_nome} <br />
                                            <b>Início:</b> {formatarDataHora(viagem.inicio_viagem)} <br />
                                            {!emAndamento && (
                                                <>
                                                    <b>Fim:</b> {formatarDataHora(viagem.fim_viagem)} <br />
                                                </>
                                            )}
                                            <b>Duração:</b> {duracao}
                                            {emAndamento && (
                                                <span className="status-em-andamento"> 🟢 Em andamento</span>
                                            )}
                                        </p>
                                        {itemSelecionado === viagem.id && (
                                            <button
                                                className="botaoExibirPercurso"
                                                onClick={() => setMenuLateral(false)}
                                            >
                                                Exibir percurso
                                            </button>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </section>
                </aside>
                <section className="direitajanela">
                    <Mapa dadosRota={dadosRota}>
                        {viagemSelecionada && (() => {
                            const coordenadas = processarRastroGPS(viagemSelecionada.rastro_gps);

                            if (!coordenadas || coordenadas.length === 0) return null;

                            const ultimaPosicao = coordenadas[coordenadas.length - 1];

                            return (
                                <>
                                    {coordenadas.slice(0, -1).map((coord, index) => {
                                        const isFirst = index === 0;
                                        const iconeNumerado = iconeNumero(index + 1);

                                        return (
                                            <Marker
                                                key={index}
                                                position={coord}
                                                icon={isFirst ? starPercursotIcon : iconeNumerado}
                                            >
                                                <Popup>
                                                    <div>
                                                        <b>{isFirst ? 'Início' : `Ponto ${index + 1}`}</b>
                                                        <p>Lat: {coord[0].toFixed(6)}</p>
                                                        <p>Lng: {coord[1].toFixed(6)}</p>
                                                    </div>
                                                </Popup>
                                            </Marker>
                                        );
                                    })}

                                    <Marker
                                        position={ultimaPosicao}
                                        icon={vehicleIcon}
                                    >
                                        <Popup>
                                            <div>
                                                <b>Posição atual</b>
                                                <p>Veículo: {viagemSelecionada.veiculo_modelo}</p>
                                                <p>Placa: {viagemSelecionada.veiculo_placa}</p>
                                                <p>Motorista: {viagemSelecionada.motorista_nome}</p>
                                                <p>Lat: {ultimaPosicao[0].toFixed(6)}</p>
                                                <p>Lng: {ultimaPosicao[1].toFixed(6)}</p>
                                            </div>
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