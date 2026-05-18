import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import './mapa.css'

import mapaProviders from '../../data/mapProviders';

export default function Mapa({ children, center = [-3.75467, -49.6751], zoom = 15, dadosRota = null }) {
    const [mapProviders, setMapProviders] = useState(mapaProviders.default);
    const [dashOffset, setDashOffset] = useState('0');

    const [selectedKey, setSelectedKey] = useState(() => {
        const saved = localStorage.getItem('map_style');
        return (saved && mapaProviders[saved]) ? saved : mapaProviders.default;
    });

    const currentProvider = mapaProviders[selectedKey];

    useEffect(() => {
        localStorage.setItem('map_style', selectedKey);
    }, [selectedKey]);

    useEffect(() => {
        const interval = setInterval(() => {
            setDashOffset(prev => (parseInt(prev) - 5) + 'px');
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <MapContainer center={center} zoom={zoom} style={{ height: '100%' }}>
                <TileLayer
                    url={currentProvider.url}
                    attribution={currentProvider.attribution}
                    maxZoom={currentProvider.maxZoom}
                    key={currentProvider.url}
                />
                {dadosRota && dadosRota.length >= 2 && (
                    <Polyline
                        positions={dadosRota}
                        pathOptions={{
                            color: 'red',
                            weight: 4,
                            dashArray: '20, 15',
                            dashOffset: dashOffset
                        }}
                    />
                )}

                {children}
            </MapContainer>
            <div className='janelaProviders'>
                <h3>Estilo de mapa</h3>
                <hr />
                <p className='pMenor'>Alterne entre os estilos de mapa e escolha a visualização mais confortável para você.</p>
                <select
                    value={selectedKey}
                    onChange={(e) => setSelectedKey(e.target.value)}
                >
                    {Object.keys(mapaProviders)
                        .filter(key => key !== 'default')
                        .map(key => (
                            <option key={key} value={key}>
                                {mapaProviders[key].name}
                            </option>
                        ))
                    }
                </select>
            </div>
        </>
    )
}