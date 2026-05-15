import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from "react"
import './veiculos.css'

import Mapa from "./components/Mapa";
import { vehicleIcon, pontoPercursoIcon, starPercursotIcon, alertIcon, iconeNumero } from './components/Icones';
import PopupInfo from './components/PopupInfo';

import viajens from "../data/rastreamento";

import { formatarDataHora } from "../utils/functions";

import VeiculoTipoCarro from '../assets/veiculoTipoCarro.png'
import VeiculoTipoVan from '../assets/veiculoTipoVan.png'
import VeiculoTipoCaminhao from '../assets/veiculoTipoCaminhao.png'

export default function Veiculos() {
    const [viajensLista, setViagensLista] = useState();
    const [viagemTeste, setViagemTeste] = useState();

    useEffect(() => {
        document.title = "SITREV - Veículos";
        setViagemTeste(viajens[3]);
    }, [])

    const [tipoPesquisa, setTipoPesquisa] = useState(1);

    const [menuLateral, setMenuLateral] = useState(true);
    const [itemSelecionado, setItemSelecionado] = useState(0);

    const veiculosLista = [
        {
            id: 1,
            identificador: "XYZ-1029",
            modelo: "Fiat Ducato 2025",
            ultima_leitura: "2026-03-09T14:23:00.000Z",
            motorista: {
                id: 101,
                nome: "Carlos Mendonça"
            },
            tipo_veiculo: "van"
        },
        {
            id: 2,
            identificador: "LSN4I49",
            modelo: "Volvo FH 540",
            ultima_leitura: "2026-03-09T09:45:00.000Z",
            motorista: {
                id: 102,
                nome: "Roberto Alves"
            },
            tipo_veiculo: "caminhão"
        },
        {
            id: 3,
            identificador: "BET-5678",
            modelo: "Hyundai HB20 2024",
            ultima_leitura: "2026-03-08T17:12:00.000Z",
            motorista: {
                id: 103,
                nome: "Fernanda Lima"
            },
            tipo_veiculo: "carro"
        },
        {
            id: 4,
            identificador: "PPA-1234",
            modelo: "Mercedes-Benz Sprinter",
            ultima_leitura: "2026-03-09T11:30:00.000Z",
            motorista: {
                id: 104,
                nome: "João Pereira"
            },
            tipo_veiculo: "van"
        },
        {
            id: 5,
            identificador: "RST-9012",
            modelo: "Scania R450",
            ultima_leitura: "2026-03-08T22:05:00.000Z",
            motorista: {
                id: 105,
                nome: "Marcelo Souza"
            },
            tipo_veiculo: "caminhão"
        },
        {
            id: 6,
            identificador: "MNO-3456",
            modelo: "Chevrolet Onix 2025",
            ultima_leitura: "2026-03-09T07:20:00.000Z",
            motorista: {
                id: 106,
                nome: "Patrícia Gomes"
            },
            tipo_veiculo: "carro"
        },
        {
            id: 7,
            identificador: "PPA-3456",
            modelo: "Renault Master",
            ultima_leitura: "2026-03-09T13:15:00.000Z",
            motorista: {
                id: 107,
                nome: "Ricardo Nunes"
            },
            tipo_veiculo: "van"
        },
        {
            id: 8,
            identificador: "PPA-7890",
            modelo: "Volkswagen Constellation 31.280",
            ultima_leitura: "2026-03-08T19:40:00.000Z",
            motorista: {
                id: 108,
                nome: "André Carvalho"
            },
            tipo_veiculo: "caminhão"
        },
        {
            id: 9,
            identificador: "UVA-2345",
            modelo: "Fiat Strada 2024",
            ultima_leitura: "2026-03-09T15:50:00.000Z",
            motorista: {
                id: 109,
                nome: "Juliana Costa"
            },
            tipo_veiculo: "carro"
        },
        {
            id: 10,
            identificador: "JKL-6789",
            modelo: "Iveco Daily",
            ultima_leitura: "2026-03-08T12:30:00.000Z",
            motorista: {
                id: 110,
                nome: "Luciano Ferreira"
            },
            tipo_veiculo: "van"
        },
        {
            id: 11,
            identificador: "QWE-4567",
            modelo: "Mercedes-Benz Axor 2544",
            ultima_leitura: "2026-03-09T08:10:00.000Z",
            motorista: {
                id: 111,
                nome: "Gustavo Oliveira"
            },
            tipo_veiculo: "caminhão"
        },
        {
            id: 12,
            identificador: "ASD-8901",
            modelo: "Toyota Corolla 2025",
            ultima_leitura: "2026-03-07T16:25:00.000Z",
            motorista: {
                id: 112,
                nome: "Beatriz Martins"
            },
            tipo_veiculo: "carro"
        },
        {
            id: 13,
            identificador: "ZXC-2345",
            modelo: "Ford Transit",
            ultima_leitura: "2026-03-09T10:05:00.000Z",
            motorista: {
                id: 113,
                nome: "Thiago Rocha"
            },
            tipo_veiculo: "van"
        },
        {
            id: 14,
            identificador: "POI-7890",
            modelo: "DAF XF 480",
            ultima_leitura: "2026-03-08T23:55:00.000Z",
            motorista: {
                id: 114,
                nome: "Cristiano Almeida"
            },
            tipo_veiculo: "caminhão"
        },
        {
            id: 15,
            identificador: "LKJ-1234",
            modelo: "Honda Civic 2024",
            ultima_leitura: "2026-03-09T18:30:00.000Z",
            motorista: {
                id: 115,
                nome: "Tatiana Ribeiro"
            },
            tipo_veiculo: "carro"
        },
        {
            id: 16,
            identificador: "MNB-4567",
            modelo: "Chevrolet Express",
            ultima_leitura: "2026-03-08T14:15:00.000Z",
            motorista: {
                id: 116,
                nome: "Felipe Cardoso"
            },
            tipo_veiculo: "van"
        },
        {
            id: 17,
            identificador: "VFR-8901",
            modelo: "MAN TGX 18.500",
            ultima_leitura: "2026-03-09T12:40:00.000Z",
            motorista: {
                id: 117,
                nome: "Leonardo Silva"
            },
            tipo_veiculo: "caminhão"
        },
        {
            id: 18,
            identificador: "QAZ-2345",
            modelo: "Nissan Kicks 2025",
            ultima_leitura: "2026-03-08T20:30:00.000Z",
            motorista: {
                id: 118,
                nome: "Camila Fernandes"
            },
            tipo_veiculo: "carro"
        },
        {
            id: 19,
            identificador: "WSX-6789",
            modelo: "Peugeot Boxer",
            ultima_leitura: "2026-03-09T16:45:00.000Z",
            motorista: {
                id: 119,
                nome: "Eduardo Barbosa"
            },
            tipo_veiculo: "van"
        },
        {
            id: 20,
            identificador: "EDC-3456",
            modelo: "Volkswagen Meteor 29.520",
            ultima_leitura: "2026-03-07T21:10:00.000Z",
            motorista: {
                id: 120,
                nome: "Diego Montenegro"
            },
            tipo_veiculo: "caminhão"
        },
        {
            id: 21,
            identificador: "RFV-7891",
            modelo: "Jeep Renegade 2024",
            ultima_leitura: "2026-03-09T06:15:00.000Z",
            motorista: {
                id: 121,
                nome: "Larissa Alves"
            },
            tipo_veiculo: "carro"
        },
        {
            id: 22,
            identificador: "TGY-1230",
            modelo: "Citroën Jumper",
            ultima_leitura: "2026-03-08T10:50:00.000Z",
            motorista: {
                id: 122,
                nome: "Samuel Dias"
            },
            tipo_veiculo: "van"
        },
        {
            id: 23,
            identificador: "HNU-4569",
            modelo: "Iveco Stralis 570",
            ultima_leitura: "2026-03-09T19:20:00.000Z",
            motorista: {
                id: 123,
                nome: "Alexandre Pires"
            },
            tipo_veiculo: "caminhão"
        }
    ];

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
                <aside className={`esquerdaJanela esquerdaVeiculos ${menuLateral && 'ativo'}`}>
                    <div className="topoJanela">
                        <span style={{ width: '100%', justifyContent: 'space-between', display: 'flex' }}>
                            <span>
                                <h2>Veículos</h2>
                                <p className="pMenor">
                                    Localize todos os veículos cadastrados no sistema
                                </p>
                            </span>
                            <button
                                className="botaoFecharJanelaLateral"
                                onClick={() => setMenuLateral(!menuLateral)}>
                                Fechar
                            </button>
                        </span>
                        <input type="text" placeholder="Pesquise qualquer coisa" />
                    </div>
                    <div className="listaJanela listaJanelaVeiculo">
                        {veiculosLista?.map((veiculo, index) => {
                            return (
                                <div className={`itemViagemLista itemVeiculoLista ${veiculo.id == itemSelecionado && 'itemAtivo'}`} key={index} onClick={() => {
                                    setItemSelecionado(veiculo.id);
                                }}>
                                    <span className='esquerda'>
                                        {veiculo.tipo_veiculo === 'carro' ?
                                            <>
                                                <img src={VeiculoTipoCarro} className='veiculoIconeLista' alt="" />
                                            </>
                                            : veiculo.tipo_veiculo === 'van' ?
                                                <>
                                                    <img src={VeiculoTipoVan} className='veiculoIconeLista' alt="" />
                                                </>
                                                : <>
                                                    <img src={VeiculoTipoCaminhao} className='veiculoIconeLista' alt="" />
                                                </>
                                        }
                                    </span>
                                    <span className='direita'>
                                        <p>
                                            <b>Modelo:</b> {veiculo.modelo}<br />
                                            <b>Identificador: </b> {veiculo.identificador} <br />
                                            <b>Ultimo registro: </b> {formatarDataHora(veiculo.ultima_leitura)} <br />
                                            <b>Ultimo motorista: </b> {veiculo.motorista.nome}
                                        </p>
                                        {itemSelecionado == veiculo.id && (
                                            <button
                                                className="botaoExibirPercurso"
                                                onClick={() => setMenuLateral(false)}
                                            >Exibir percurso</button>
                                        )}
                                    </span>
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