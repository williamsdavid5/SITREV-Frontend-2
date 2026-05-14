import { formatarDataHora } from "../../utils/functions";

const PopupInfo = ({
    tipo, // 'inicio', 'ponto', 'veiculo'
    viagem,
    pontoNumero = null,
    posicaoVeiculo
}) => {

    const handleCompartilhar = () => {
        if (!posicaoVeiculo) return;
        const [lat, lng] = posicaoVeiculo;

        if (navigator.share) {
            navigator.share({
                title: 'Localização do veículo',
                text: `Veículo está em: ${lat}, ${lng}`,
                url: `https://www.google.com/maps?q=${lat},${lng}`
            });
        } else {
            navigator.clipboard.writeText(`${lat}, ${lng}`);
            alert('Coordenadas copiadas!');
        }
    };

    const handleAbrirMaps = () => {
        if (!posicaoVeiculo) return;
        const [lat, lng] = posicaoVeiculo;
        window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    };

    const getTitulo = () => {
        switch (tipo) {
            case 'inicio':
                return 'Início de Percurso';
            case 'ponto':
                return `Ponto de Percurso ${pontoNumero}`;
            case 'veiculo':
                return 'Último registro recebido';
            default:
                return 'Informação';
        }
    };

    const getVelocidade = () => {
        if (tipo === 'veiculo') {
            const ultimoRegistro = viagem.registros[viagem.registros.length - 1];
            return ultimoRegistro?.velocidade || 'N/A';
        }

        if (tipo === 'inicio' || tipo === 'ponto') {
            const registro = viagem.registros[pontoNumero - 1];
            return registro?.velocidade || 'N/A';
        }

        return 'N/A';
    };

    return (
        <div className='popUpMapa'>
            <p>
                <strong>{getTitulo()}</strong><br />
                <b>Motorista: </b>{viagem.nome_motorista}<br />
                <b>Velocidade:</b> {getVelocidade()} km/h<br />
                <b>{formatarDataHora(viagem.inicio)}</b><br />
            </p>

            <button
                className='botaoPopUpMapa'
                onClick={handleCompartilhar}
            >
                Compartilhar localização
            </button>

            <button
                className='botaoPopUpMapa'
                onClick={handleAbrirMaps}
            >
                Google Maps
            </button>
        </div>
    );
};

export default PopupInfo;