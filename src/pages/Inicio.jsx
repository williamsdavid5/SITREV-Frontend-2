import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { useEffect, useState } from 'react';
import viajens from '../data/rastreamento';

import './inicio.css'
import Mapa from './components/Mapa';

import { vehicleIcon, pontoPercursoIcon, starPercursotIcon, alertIcon, iconeNumero } from './components/Icones';
import PopupInfo from './components/PopupInfo';


export default function Inicio() {
    const [dados, setDados] = useState(viajens);
    const [viagemSelecionada, setViagemSelecionada] = useState({ id: 0 });
    const [dadosPercurso, setDadosPercurso] = useState(null);

    useEffect(() => {
        if (viagemSelecionada.id != 0) {
            const rotaCoordenadas = viagemSelecionada.registros.map(reg => [
                parseFloat(reg.latitude),
                parseFloat(reg.longitude)
            ]);
            setDadosPercurso(rotaCoordenadas);
        }

    }, [viagemSelecionada])

    const alternarPercurso = (viagem) => {
        setViagemSelecionada(viagemSelecionada.id === viagem.id ? { id: 0 } : viagem);
    };

    useEffect(() => {
        document.title = "SITREV - Início";
    }, [])


    return (
        <>
            <main className="inicioMain">
                <Mapa dadosRota={dadosPercurso}>
                    {dados.map((viagem) => {
                        const registros = viagem.registros;
                        const ultimoRegistro = registros[registros.length - 1];
                        const isSelecionada = viagemSelecionada.id === viagem.id;
                        const ultimoHorario = new Date(ultimoRegistro.timestamp).toLocaleString();

                        const posicaoVeiculo = [
                            parseFloat(ultimoRegistro.latitude),
                            parseFloat(ultimoRegistro.longitude)
                        ];

                        return (
                            <div key={viagem.id}>
                                {isSelecionada && (
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
                                                            viagem={viagem}
                                                            pontoNumero={index + 1}
                                                            posicaoVeiculo={posicaoVeiculo}
                                                        />
                                                    </Popup>
                                                </Marker>
                                            );
                                        })}
                                    </>
                                )}

                                <Marker
                                    position={posicaoVeiculo}
                                    icon={vehicleIcon}
                                    eventHandlers={{
                                        click: () => alternarPercurso(viagem),
                                    }}
                                >
                                    <Popup>
                                        <PopupInfo
                                            tipo="veiculo"
                                            viagem={viagem}
                                            posicaoVeiculo={posicaoVeiculo}
                                        />
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