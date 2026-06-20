// pages/Veiculos.jsx
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from "react"
import './veiculos.css'

import Mapa from "./components/Mapa";
import { vehicleIcon, pontoPercursoIcon, starPercursotIcon, alertIcon, iconeNumero } from './components/Icones';
import PopupInfo from './components/PopupInfo';

import { formatarDataHora } from "../utils/functions";
import { useVeiculos } from '../contexts/VeiculosContext';

import VeiculoTipoCarro from '../assets/veiculoTipoCarro.png'
import VeiculoTipoVan from '../assets/veiculoTipoVan.png'
import VeiculoTipoCaminhao from '../assets/veiculoTipoCaminhao.png'

function ModalMaisDetalhes({ veiculo, setVisivel }) {
    const { viagensVeiculo, loadingViagens } = useVeiculos();

    const calcularDuracao = (duracaoHoras) => {
        if (!duracaoHoras) return 'Em andamento';
        const horas = Math.floor(duracaoHoras);
        const minutos = Math.round((duracaoHoras - horas) * 60);
        if (horas > 0) {
            return `${horas}h ${minutos}min`;
        }
        return `${minutos}min`;
    };

    return (
        <>
            <div className='backgroudModal'>
                <section className='janelaModal'>
                    <section className='espacoEntre'>
                        <span>
                            <div className='topoModal'>
                                {veiculo.tipo_veiculo === 'carro' ? (
                                    <img src={VeiculoTipoCarro} alt="Carro" />
                                ) : veiculo.tipo_veiculo === 'van' ? (
                                    <img src={VeiculoTipoVan} alt="Van" />
                                ) : (
                                    <img src={VeiculoTipoCaminhao} alt="Caminhão" />
                                )}
                                <div>
                                    <h1>{veiculo.modelo} - {veiculo.placa}</h1>
                                    <h3>ID: {veiculo.id}</h3>
                                    <p>
                                        <b>Ultimo motorista: </b> {veiculo.ultimo_motorista || 'Não informado'} <br />
                                        <b>Ultimo registro: </b> {formatarDataHora(veiculo.ultimo_registro)}
                                    </p>
                                </div>
                            </div>
                        </span>
                        <button onClick={() => setVisivel(false)} className='botaoFecharModal'>
                            X
                        </button>
                    </section>
                    <hr />
                    <p><b>Histórico de Viagens</b></p>
                    {loadingViagens ? (
                        <div className="loading-viagens">Carregando histórico...</div>
                    ) : viagensVeiculo.length === 0 ? (
                        <div className="vazio-viagens">
                            <p>Nenhuma viagem registrada para este veículo.</p>
                        </div>
                    ) : (
                        <div className='tabelaViagensContainer'>
                            <table border={1} className='tabelaViagens'>
                                <thead>
                                    <tr>
                                        <th>ID da Viagem</th>
                                        <th>Motorista</th>
                                        <th>Duração</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {viagensVeiculo.map((viagem) => (
                                        <tr key={viagem.id}>
                                            <td>{viagem.id}</td>
                                            <td>{viagem.motorista_nome}</td>
                                            <td>{calcularDuracao(viagem.duracao)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </>
    )
}

export default function Veiculos() {
    const {
        veiculos,
        loading,
        error,
        buscarVeiculos,
        recarregar,
        searchTerm,
        selecionarVeiculo,
        processarRastroGPS,
        veiculoSelecionado,
        limparSelecao
    } = useVeiculos();

    const [buscaLocal, setBuscaLocal] = useState('');
    const [menuLateral, setMenuLateral] = useState(true);
    const [itemSelecionado, setItemSelecionado] = useState({ id: 0 });
    const [modalMaisInformacoes, setModalMaisInformacoes] = useState(false);
    const [dadosRota, setDadosRota] = useState(null);
    const [posicaoVeiculo, setPosicaoVeiculo] = useState(null);

    useEffect(() => {
        document.title = "SITREV - Veículos";
        recarregar();
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (buscaLocal !== searchTerm) {
                buscarVeiculos(buscaLocal);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [buscaLocal, buscarVeiculos, searchTerm]);

    useEffect(() => {
        if (itemSelecionado && itemSelecionado.id !== 0) {
            selecionarVeiculo(itemSelecionado);

            const coordenadas = processarRastroGPS(itemSelecionado.rastro_gps_ultima_viagem);
            if (coordenadas.length > 0) {
                setDadosRota(coordenadas);
                const ultimaPosicao = coordenadas[coordenadas.length - 1];
                setPosicaoVeiculo(ultimaPosicao);
            } else {
                setDadosRota(null);
                setPosicaoVeiculo(null);
            }
        } else {
            limparSelecao();
            setDadosRota(null);
            setPosicaoVeiculo(null);
        }
    }, [itemSelecionado, selecionarVeiculo, processarRastroGPS, limparSelecao]);

    const getTipoVeiculo = (veiculo) => {
        if (veiculo.tipo_veiculo) {
            return veiculo.tipo_veiculo;
        }
        const modelo = veiculo.modelo?.toLowerCase() || '';
        if (modelo.includes('carro') || modelo.includes('hb20') || modelo.includes('onix') ||
            modelo.includes('civic') || modelo.includes('corolla') || modelo.includes('kicks')) {
            return 'carro';
        }
        if (modelo.includes('van') || modelo.includes('sprinter') || modelo.includes('daily') ||
            modelo.includes('transit') || modelo.includes('jumper') || modelo.includes('master')) {
            return 'van';
        }
        return 'caminhão';
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
                <aside className={`esquerdaJanela esquerdaVeiculos ${menuLateral && 'ativo'}`}>
                    <section className="topoJanela">
                        <span className='espacoEntre'>
                            <span>
                                <h2>Veículos</h2>
                                <p className="pMenor">
                                    Localize todos os veículos cadastrados no sistema
                                </p>
                            </span>
                            <button
                                className="botaoFecharJanelaLateral"
                                onClick={() => setMenuLateral(!menuLateral)}>
                                ❮
                            </button>
                        </span>
                        <input
                            type="text"
                            placeholder="Pesquisar por modelo ou placa..."
                            value={buscaLocal}
                            onChange={(e) => setBuscaLocal(e.target.value)}
                        />
                    </section>
                    <section className="listaJanela listaJanelaVeiculo">
                        {loading ? (
                            <div className="loading-veiculos">Carregando veículos...</div>
                        ) : error ? (
                            <div className="error-veiculos">
                                <p>{error}</p>
                                <button onClick={() => recarregar()}>Tentar novamente</button>
                            </div>
                        ) : veiculos.length === 0 ? (
                            <div className="vazio-veiculos">
                                <p>Nenhum veículo encontrado.</p>
                                {searchTerm && <p>Tente buscar por outro termo.</p>}
                            </div>
                        ) : (
                            veiculos.map((veiculo) => {
                                const tipo = getTipoVeiculo(veiculo);
                                return (
                                    <div
                                        className={`itemViagemLista itemVeiculoLista ${veiculo.id === itemSelecionado.id && 'itemAtivo'}`}
                                        key={veiculo.id}
                                        onClick={() => {
                                            setItemSelecionado(veiculo);
                                        }}
                                    >
                                        <span className='esquerda'>
                                            {tipo === 'carro' ? (
                                                <img src={VeiculoTipoCarro} className='veiculoIconeLista' alt="Carro" />
                                            ) : tipo === 'van' ? (
                                                <img src={VeiculoTipoVan} className='veiculoIconeLista' alt="Van" />
                                            ) : (
                                                <img src={VeiculoTipoCaminhao} className='veiculoIconeLista' alt="Caminhão" />
                                            )}
                                        </span>
                                        <span className='direita'>
                                            <p>
                                                <b>Modelo:</b> {veiculo.modelo}<br />
                                                <b>Placa:</b> {veiculo.placa} <br />
                                                <b>Ultimo registro:</b> {formatarDataHora(veiculo.ultimo_registro)} <br />
                                                <b>Ultimo motorista:</b> {veiculo.ultimo_motorista || 'Não informado'}
                                            </p>
                                            {itemSelecionado.id === veiculo.id && (
                                                <>
                                                    <button
                                                        className="botaoExibirPercurso"
                                                        onClick={() => setMenuLateral(false)}
                                                    >Exibir percurso</button>
                                                    <button
                                                        className='botaoExibirPercurso botaoMaisInfor'
                                                        onClick={() => setModalMaisInformacoes(true)}
                                                    >Mais informações</button>
                                                </>
                                            )}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </section>
                </aside>
                <section className="direitajanela">
                    <Mapa dadosRota={dadosRota}>
                        {dadosRota && dadosRota.length > 0 && posicaoVeiculo && (
                            <>
                                {dadosRota.slice(0, -1).map((coord, index) => {
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
                                    position={posicaoVeiculo}
                                    icon={vehicleIcon}
                                >
                                    <Popup>
                                        <div>
                                            <b>Posição atual</b>
                                            <p>Veículo: {itemSelecionado.modelo}</p>
                                            <p>Placa: {itemSelecionado.placa}</p>
                                            <p>Lat: {posicaoVeiculo[0].toFixed(6)}</p>
                                            <p>Lng: {posicaoVeiculo[1].toFixed(6)}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            </>
                        )}
                    </Mapa>
                </section>
            </main>
            {modalMaisInformacoes && (
                <ModalMaisDetalhes
                    veiculo={itemSelecionado}
                    setVisivel={setModalMaisInformacoes}
                />
            )}
        </>
    )
}