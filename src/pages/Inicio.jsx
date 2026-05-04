import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import './inicio.css'
import Mapa from './components/Mapa';

export default function Inicio() {
    const position = [-3.75467, -49.6751];
    return (
        <>
            <main className="inicioMain">
                <Mapa center={position} zoom={10}>
                    {/* <Marker position={position} /> */}
                </Mapa>
            </main>
        </>
    )
}