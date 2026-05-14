import L from 'leaflet';
import veiculoIcon from '../../assets/veiculoIcon.png';
import pontoIcon from '../../assets/pontoIcon.png';
import startIcon from '../../assets/startIcon.png';
import alertaIcon from '../../assets/alertaIcon.png';


export const vehicleIcon = new L.Icon({
    iconUrl: veiculoIcon,
    iconSize: [50, 50],
    iconAnchor: [15, 15],
    className: 'iconeVeiculo'
});

export const pontoPercursoIcon = new L.Icon({
    iconUrl: pontoIcon,
    iconSize: [35, 35],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
    className: 'pontoIcon'
});

export const starPercursotIcon = new L.Icon({
    iconUrl: startIcon,
    iconSize: [40, 40],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
    className: 'startIcon'
});

export const alertIcon = new L.Icon({
    iconUrl: alertaIcon,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    className: 'iconeAlerta'
});


export const iconeNumero = (number, color = 'var(--destaque1)') => {
    return L.divIcon({
        html: `<div style="
                background: ${color};
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
            ">${number}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14]
    });
};