import { useEffect, useState } from "react";
import './motoristas.css'
import FotoMotorista from '../assets/motoristaFoto.png'
import { formatarDataHora } from "../utils/functions";

export default function Motoristas() {
    useEffect(() => {
        document.title = "SITREV - Motoristas";
    }, [])

    const [itemSelecionado, setItemSelecionado] = useState({ id: 0 });

    const motoristasLista = [
        {
            id: 101,
            nome: "Carlos Mendonça",
            ultima_viagem_timestamp: "2026-03-09T10:45:00.000Z",
            ultimo_veiculo_usado: "Volvo FH 540",
            estado_atual: "em viagem"
        },
        {
            id: 102,
            nome: "Roberto Alves",
            ultima_viagem_timestamp: "2026-03-09T14:20:00.000Z",
            ultimo_veiculo_usado: "Scania R450",
            estado_atual: "parado"
        },
        {
            id: 103,
            nome: "Fernanda Lima",
            ultima_viagem_timestamp: "2026-03-08T18:30:00.000Z",
            ultimo_veiculo_usado: "Hyundai HB20 2024",
            estado_atual: "parado"
        },
        {
            id: 104,
            nome: "João Pereira",
            ultima_viagem_timestamp: "2026-03-09T09:15:00.000Z",
            ultimo_veiculo_usado: "Mercedes-Benz Sprinter",
            estado_atual: "em viagem"
        },
        {
            id: 105,
            nome: "Marcelo Souza",
            ultima_viagem_timestamp: "2026-03-09T03:30:00.000Z",
            ultimo_veiculo_usado: "Volkswagen Constellation 31.280",
            estado_atual: "parado"
        },
        {
            id: 106,
            nome: "Patrícia Gomes",
            ultima_viagem_timestamp: "2026-03-09T11:50:00.000Z",
            ultimo_veiculo_usado: "Chevrolet Onix 2025",
            estado_atual: "em viagem"
        },
        {
            id: 107,
            nome: "Ricardo Nunes",
            ultima_viagem_timestamp: "2026-03-08T19:45:00.000Z",
            ultimo_veiculo_usado: "Renault Master",
            estado_atual: "parado"
        },
        {
            id: 108,
            nome: "André Carvalho",
            ultima_viagem_timestamp: "2026-03-09T16:30:00.000Z",
            ultimo_veiculo_usado: "Iveco Stralis 570",
            estado_atual: "em viagem"
        },
        {
            id: 109,
            nome: "Juliana Costa",
            ultima_viagem_timestamp: "2026-03-08T04:45:00.000Z",
            ultimo_veiculo_usado: "Fiat Strada 2024",
            estado_atual: "parado"
        },
        {
            id: 110,
            nome: "Luciano Ferreira",
            ultima_viagem_timestamp: "2026-03-09T15:20:00.000Z",
            ultimo_veiculo_usado: "Iveco Daily",
            estado_atual: "em viagem"
        },
        {
            id: 111,
            nome: "Gustavo Oliveira",
            ultima_viagem_timestamp: "2026-03-08T12:15:00.000Z",
            ultimo_veiculo_usado: "Mercedes-Benz Axor 2544",
            estado_atual: "parado"
        },
        {
            id: 112,
            nome: "Beatriz Martins",
            ultima_viagem_timestamp: "2026-03-09T17:45:00.000Z",
            ultimo_veiculo_usado: "Toyota Corolla 2025",
            estado_atual: "parado"
        },
        {
            id: 113,
            nome: "Thiago Rocha",
            ultima_viagem_timestamp: "2026-03-08T21:10:00.000Z",
            ultimo_veiculo_usado: "Ford Transit",
            estado_atual: "parado"
        },
        {
            id: 114,
            nome: "Cristiano Almeida",
            ultima_viagem_timestamp: "2026-03-09T08:45:00.000Z",
            ultimo_veiculo_usado: "DAF XF 480",
            estado_atual: "em viagem"
        },
        {
            id: 115,
            nome: "Tatiana Ribeiro",
            ultima_viagem_timestamp: "2026-03-08T01:20:00.000Z",
            ultimo_veiculo_usado: "Honda Civic 2024",
            estado_atual: "parado"
        },
        {
            id: 116,
            nome: "Felipe Cardoso",
            ultima_viagem_timestamp: "2026-03-09T18:00:00.000Z",
            ultimo_veiculo_usado: "Chevrolet Express",
            estado_atual: "parado"
        },
        {
            id: 117,
            nome: "Leonardo Silva",
            ultima_viagem_timestamp: "2026-03-08T15:40:00.000Z",
            ultimo_veiculo_usado: "MAN TGX 18.500",
            estado_atual: "parado"
        },
        {
            id: 118,
            nome: "Camila Fernandes",
            ultima_viagem_timestamp: "2026-03-09T20:15:00.000Z",
            ultimo_veiculo_usado: "Nissan Kicks 2025",
            estado_atual: "em viagem"
        },
        {
            id: 119,
            nome: "Eduardo Barbosa",
            ultima_viagem_timestamp: "2026-03-09T01:30:00.000Z",
            ultimo_veiculo_usado: "Peugeot Boxer",
            estado_atual: "parado"
        },
        {
            id: 120,
            nome: "Diego Montenegro",
            ultima_viagem_timestamp: "2026-03-09T07:50:00.000Z",
            ultimo_veiculo_usado: "Volkswagen Meteor 29.520",
            estado_atual: "parado"
        },
        {
            id: 121,
            nome: "Larissa Alves",
            ultima_viagem_timestamp: "2026-03-08T17:30:00.000Z",
            ultimo_veiculo_usado: "Jeep Renegade 2024",
            estado_atual: "parado"
        },
        {
            id: 122,
            nome: "Samuel Dias",
            ultima_viagem_timestamp: "2026-03-09T22:00:00.000Z",
            ultimo_veiculo_usado: "Citroën Jumper",
            estado_atual: "em viagem"
        },
        {
            id: 123,
            nome: "Alexandre Pires",
            ultima_viagem_timestamp: "2026-03-08T03:20:00.000Z",
            ultimo_veiculo_usado: "Volvo FH 540",
            estado_atual: "parado"
        }
    ];

    return (
        <>
            <main className="mainMotoristas">
                <section className="topoMotoristas">
                    <span className="espacoEntre auxTopoMotoristas">
                        <span>
                            <h1>Motoristas</h1>
                            <p>Todos os motoristas cadastrados no sistema</p>
                        </span>
                        <input type="text" placeholder="Pesquise qualquer coisa" className="inputPesquisaMotorista" />
                    </span>

                </section>
                <section className={`blocosMotoristas`}>
                    {motoristasLista.map((motorista) => (
                        <div className={`bloco ${itemSelecionado.id == motorista.id && 'blocoSelecionado'}`} key={motorista.id} onClick={() => setItemSelecionado(motorista)}>
                            <div className="esquerda">
                                <img src={FotoMotorista} className="motoristaFoto" alt={`Foto ${motorista.nome}`} />
                            </div>
                            <div className="direita">
                                <h3><b>{motorista.nome} - ID {motorista.id}</b></h3>
                                <hr />
                                <p>
                                    <b>Ultimo registro em:</b> {formatarDataHora(motorista.ultima_viagem_timestamp)} <br />
                                    <b>Ultimo veículo usado:</b> {motorista.ultimo_veiculo_usado} <br />
                                    {motorista.estado_atual === "parado" ? (
                                        <span className="destaqueGreen"><b>Parado</b></span>
                                    ) : (
                                        <span className="destaqueGold"><b>Em viagem</b></span>
                                    )}
                                </p>
                                {/* {itemSelecionado.id == motorista.id && (
                                    <>
                                        <span style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                            <button
                                                className="botaoVerMaisMotorista"
                                            >Ver mais</button>
                                        </span>
                                    </>
                                )} */}
                            </div>
                        </div>
                    ))}
                </section>
            </main>
        </>
    )
}