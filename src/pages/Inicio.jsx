import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
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
    iconSize: [40, 40],
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
    iconSize: [35, 35],
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

                        // Coordenadas para a Polyline
                        const rotaCoordenadas = registros.map(reg => [
                            parseFloat(reg.latitude),
                            parseFloat(reg.longitude)
                        ]);

                        return (
                            <div key={viagem.id}>
                                {/* 1. Renderiza o Percurso APENAS se a viagem estiver selecionada */}
                                {isSelecionada && (
                                    <>
                                        <Polyline
                                            positions={rotaCoordenadas}
                                            pathOptions={{
                                                color: '#3498db',
                                                dashArray: '10, 10',
                                                weight: 3
                                            }}
                                        />

                                        {/* Pontos intermediários (exceto o último que é o veículo) */}
                                        {registros.slice(0, -1).map((reg, index) => {
                                            const isFirst = index === 0;
                                            return (
                                                <Marker
                                                    key={reg.id}
                                                    position={[parseFloat(reg.latitude), parseFloat(reg.longitude)]}
                                                    icon={isFirst ? starPercursotIcon : pontoPercursoIcon}
                                                >
                                                    <Popup>
                                                        <strong>{isFirst ? 'Início do Percurso' : 'Ponto de Percurso'}</strong><br />
                                                        Velocidade: {reg.velocidade} km/h<br />
                                                        Hora: {new Date(reg.timestamp).toLocaleTimeString()}
                                                    </Popup>
                                                </Marker>
                                            );
                                        })}
                                    </>
                                )}

                                {/* 2. Veículo (Sempre visível - Último ponto) */}
                                <Marker
                                    position={[parseFloat(ultimoRegistro.latitude), parseFloat(ultimoRegistro.longitude)]}
                                    icon={vehicleIcon}
                                    eventHandlers={{
                                        click: () => alternarPercurso(viagem.id),
                                    }}
                                >
                                    <Popup>
                                        <strong>Veículo: {viagem.identificador_veiculo}</strong><br />
                                        Velocidade: {ultimoRegistro.velocidade} km/h<br />
                                        Hora: {new Date(ultimoRegistro.timestamp).toLocaleTimeString()}<br />
                                        Status: {isSelecionada ? "📍 Exibindo Percurso" : "👆 Clique para ver percurso completo"}
                                    </Popup>
                                </Marker>

                                {/* 3. Alertas (Sempre visíveis, posicionados no último registro) */}
                                {viagem.alertas && viagem.alertas.length > 0 && viagem.alertas.map((alerta) => {
                                    return (
                                        <Marker
                                            key={`alerta-${alerta.id}`}
                                            position={[
                                                parseFloat(ultimoRegistro.latitude),
                                                parseFloat(ultimoRegistro.longitude)
                                            ]}
                                            icon={alertIcon}
                                        >
                                            <Popup>
                                                <div style={{ minWidth: '150px' }}>
                                                    <strong style={{ color: 'red', display: 'block', marginBottom: '5px' }}>
                                                        ⚠️ ALERTA: {alerta.tipo}
                                                    </strong>
                                                    <p style={{ margin: '0', fontSize: '12px' }}>
                                                        {alerta.descricao}
                                                    </p>
                                                    <small style={{ color: '#666' }}>
                                                        Hora: {new Date(alerta.timestamp).toLocaleTimeString()}
                                                    </small>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    );
                                })}
                            </div>
                        );
                    })}
                </Mapa>
            </main>
        </>
    )
}