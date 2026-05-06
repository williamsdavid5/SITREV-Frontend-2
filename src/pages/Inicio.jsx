import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { useEffect, useState } from 'react';
import viajens from '../data/rastreamento';

import './inicio.css'
import Mapa from './components/Mapa';

import veiculoIcon from '../assets/veiculoIcon.png';
import pontoIcon from '../assets/pontoIcon.png'
import startIcon from '../assets/startIcon.png';
import alertaIcon from '../assets/alertaIcon.png';

const vehicleIcon = new L.Icon({
    iconUrl: veiculoIcon,
    iconSize: [50, 50],
    iconAnchor: [15, 15],
    className: 'iconeVeiculo'
});

const pontoPercursoIcon = new L.Icon({
    iconUrl: pontoIcon,
    iconSize: [35, 35],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
    className: 'pontoIcon'
});

const starPercursotIcon = new L.Icon({
    iconUrl: startIcon,
    iconSize: [40, 40],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
    className: 'startIcon'
});

const alertIcon = new L.Icon({
    iconUrl: alertaIcon,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    className: 'iconeAlerta'
});


export default function Inicio() {
    const [dados, setDados] = useState(viajens);
    const [viagemSelecionada, setViagemSelecionada] = useState(null);

    // para mostrar uma viagem por vez no mapa
    const alternarPercurso = (id) => {
        setViagemSelecionada(viagemSelecionada === id ? null : id);
    };

    async function compartilharLocalizacao(lat, lng) {
        const url = `https://www.google.com/maps?q=${lat},${lng}`;
        const mensagem = `Veja minha localização: ${url}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Minha localização",
                    text: mensagem,
                    url,
                });
            } catch (err) {
                console.error("Erro ao compartilhar:", err);
            }
        } else {
            // fallback: abre WhatsApp
            const linkWhatsapp = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
            window.open(linkWhatsapp, "_blank");
        }
    }

    function abrirNoMaps(lat, lng) {
        if (!lat || !lng) {
            console.warn("Coordenadas inválidas para compartilhamento.");
            return;
        }

        const url = `https://www.google.com/maps?q=${lat},${lng}`;

        // se estiver em um dispositivo mobile, tenta abrir o app do Maps
        const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
        const link = isMobile ? `geo:${lat},${lng}?q=${lat},${lng}` : url;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(url)}`;

        window.open(link, "_blank");
    }

    function formatarDataHora(isoString) {
        const data = new Date(isoString);

        const dia = String(data.getUTCDate()).padStart(2, '0');
        const mes = String(data.getUTCMonth() + 1).padStart(2, '0');
        const ano = data.getUTCFullYear();

        const hora = String(data.getUTCHours()).padStart(2, '0');
        const minuto = String(data.getUTCMinutes()).padStart(2, '0');

        return `${dia}/${mes}/${ano} - ${hora}:${minuto}`;
    }




    useEffect(() => {
        document.title = "SITREV - Início";
    }, [])

    const position = [-3.75467, -49.6751];
    return (
        <>
            <main className="inicioMain">
                <Mapa center={position} zoom={15}>

                    {dados.map((viagem) => {
                        const registros = viagem.registros;
                        const ultimoRegistro = registros[registros.length - 1];
                        const isSelecionada = viagemSelecionada === viagem.id;
                        const ultimoHorario = new Date(ultimoRegistro.timestamp).toLocaleString();

                        const rotaCoordenadas = registros.map(reg => [
                            parseFloat(reg.latitude),
                            parseFloat(reg.longitude)
                        ]);

                        const posicaoVeiculo = [
                            parseFloat(ultimoRegistro.latitude),
                            parseFloat(ultimoRegistro.longitude)
                        ];

                        return (
                            <div key={viagem.id}>
                                {/* Renderiza o Percurso APENAS se a viagem estiver selecionada */}
                                {isSelecionada && (
                                    <>
                                        <Polyline
                                            positions={rotaCoordenadas}
                                            pathOptions={{
                                                color: 'var(--destaque1)',
                                                dashArray: '0, 0',
                                                weight: 3
                                            }}
                                        />

                                        {/* Pontos do percurso (todos exceto o último que é o veículo) */}
                                        {registros.slice(0, -1).map((reg, index) => {
                                            const isFirst = index === 0;

                                            const iconeNumerado = L.divIcon({
                                                html: `<div style="
                                                        background: var(--destaque1);
                                                        width: 18px;
                                                        height: 18px;
                                                        border-radius: 50%;
                                                        display: flex;
                                                        align-items: center;
                                                        justify-content: center;
                                                        color: white;
                                                        font-weight: bold;
                                                        font-size: 12px;
                                                        border: 4px solid white;
                                                        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                                                    ">${index + 1}</div>`,
                                                iconSize: [28, 28],
                                                iconAnchor: [14, 14],
                                                popupAnchor: [0, -14]
                                            });


                                            return (
                                                <Marker
                                                    key={reg.id}
                                                    position={[parseFloat(reg.latitude), parseFloat(reg.longitude)]}
                                                    icon={isFirst ? starPercursotIcon : iconeNumerado}
                                                >
                                                    <Popup>
                                                        {isFirst ? (
                                                            <>
                                                                <div className='popUpMapa'>
                                                                    <p>
                                                                        <strong>Início de Percurso</strong><br />
                                                                        <b>Motorista: </b>{viagem.nome_motorista}<br />
                                                                        <b>Velocidade atual:</b> {reg.velocidade} km/h<br />
                                                                        <b>{formatarDataHora(viagem.inicio)}</b><br />
                                                                    </p>

                                                                    <button
                                                                        className='botaoPopUpMapa'
                                                                        onClick={() => {
                                                                            const [lat, lng] = posicaoVeiculo;
                                                                            compartilharLocalizacao(lat, lng);
                                                                        }}
                                                                    >
                                                                        Compartilhar localização
                                                                    </button>

                                                                    <button
                                                                        className='botaoPopUpMapa'
                                                                        onClick={() => {
                                                                            const [lat, lng] = posicaoVeiculo;
                                                                            abrirNoMaps(lat, lng);
                                                                        }}
                                                                    >
                                                                        Google Maps
                                                                    </button>
                                                                </div>

                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className='popUpMapa'>
                                                                    <p>
                                                                        <strong>Ponto de Percurso</strong><br />
                                                                        <b>Motorista: </b>{viagem.nome_motorista}<br />
                                                                        <b>Velocidade atual:</b> {reg.velocidade} km/h<br />
                                                                        <b>{formatarDataHora(viagem.inicio)}</b><br />
                                                                    </p>

                                                                    <button
                                                                        className='botaoPopUpMapa'
                                                                        onClick={() => {
                                                                            const [lat, lng] = posicaoVeiculo;
                                                                            compartilharLocalizacao(lat, lng);
                                                                        }}
                                                                    >
                                                                        Compartilhar localização
                                                                    </button>

                                                                    <button
                                                                        className='botaoPopUpMapa'
                                                                        onClick={() => {
                                                                            const [lat, lng] = posicaoVeiculo;
                                                                            abrirNoMaps(lat, lng);
                                                                        }}
                                                                    >
                                                                        Google Maps
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </Popup>
                                                </Marker>
                                            );
                                        })}
                                    </>
                                )}

                                {/* Veículo (Sempre visível - Último ponto) */}
                                <Marker
                                    position={posicaoVeiculo}
                                    icon={vehicleIcon}
                                    eventHandlers={{
                                        click: () => alternarPercurso(viagem.id),
                                    }}
                                >
                                    <Popup>
                                        <div className='popUpMapa'>
                                            <p>
                                                <strong>Último registro recebido atual</strong><br />
                                                <b>Motorista: </b>{viagem.nome_motorista}<br />
                                                <b>Velocidade atual:</b> {viagem.registros.slice(-1)[0].velocidade} km/h<br />
                                                <b>{formatarDataHora(viagem.inicio)}<br /></b>
                                            </p>

                                            <button
                                                className='botaoPopUpMapa'
                                                onClick={() => {
                                                    const [lat, lng] = posicaoVeiculo;
                                                    compartilharLocalizacao(lat, lng);
                                                }}
                                            >
                                                Compartilhar localização
                                            </button>

                                            <button
                                                className='botaoPopUpMapa'
                                                onClick={() => {
                                                    const [lat, lng] = posicaoVeiculo;
                                                    abrirNoMaps(lat, lng);
                                                }}
                                            >
                                                Google Maps
                                            </button>
                                        </div>
                                    </Popup>
                                </Marker>
                            </div>
                        );
                    })}

                </Mapa>
            </main>
        </>
    )
}