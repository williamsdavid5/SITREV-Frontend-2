import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import './registros.css'

import Mapa from "./components/Mapa"


import veiculoIcon from '../assets/veiculoIcon.png';
import pontoIcon from '../assets/pontoIcon.png'
import startIcon from '../assets/startIcon.png';
import alertaIcon from '../assets/alertaIcon.png';

export default function Registros() {
    useEffect(() => {
        document.title = "SITREV - Registros";
    }, [])

    const [tipoPesquisa, setTipoPesquisa] = useState(1);

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

    const position = [-3.75467, -49.6751];

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