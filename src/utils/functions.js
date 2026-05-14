export function formatarDataHora(isoString) {
    const data = new Date(isoString);

    const dia = String(data.getUTCDate()).padStart(2, '0');
    const mes = String(data.getUTCMonth() + 1).padStart(2, '0');
    const ano = data.getUTCFullYear();

    const hora = String(data.getUTCHours()).padStart(2, '0');
    const minuto = String(data.getUTCMinutes()).padStart(2, '0');

    return `${dia}/${mes}/${ano} - ${hora}:${minuto}`;
}