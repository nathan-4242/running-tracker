export type Coordenada = { //Define o tipo que cada propriedade vai seguir
    latitude: number,
    longitude: number,
    precisao: number,
    horario: number
}

export type ResultadoValidacao = {
    valido: boolean,
    motivo: string
}

export type ResultadoPace = {
    paceMinPorKm: number,
    velocidadeMediaKmH: number
}

export function coordenadaValida(coordenada: Coordenada): ResultadoValidacao {
    const valoresSaoFinitos = [
        coordenada.latitude,
        coordenada.longitude,
        coordenada.precisao,
        coordenada.horario,
    ].every(Number.isFinite)

    if (!valoresSaoFinitos) { return { valido: false, motivo: "A coordenada possui valores inválidos não finitos" } }
    if (coordenada.latitude > 90 || coordenada.latitude < -90) { return { valido: false, motivo: "Latitude inválida" } }
    if (coordenada.longitude > 180 || coordenada.longitude < -180) { return { valido: false, motivo: "Longitude inválida" } }
    if (coordenada.precisao < 0 || coordenada.precisao > 20) { return { valido: false, motivo: "Precisão inválida" } }
    if (coordenada.horario <= 0) { return { valido: false, motivo: "Horário de captura inválido" } }
    else {
        return { valido: true, motivo: "Todos os dados são válidos" };
    };
};

function grauParaRadiano(grau: number): number {
    return (grau / 180) * Math.PI
}

export function calcularDistanciaMetros(origem: Coordenada, destino: Coordenada): number { //define o tipo de retorno
    const raioTerraMetros = 6_371_000;
    const latitudeOrigem = grauParaRadiano(origem.latitude);
    const latitudeDestino = grauParaRadiano(destino.latitude);
    const diferencaLatitude = grauParaRadiano(destino.latitude - origem.latitude);
    const diferencaLongitude = grauParaRadiano(destino.longitude - origem.longitude);

    const haversine =
        Math.sin(diferencaLatitude / 2) ** 2 +
        Math.cos(latitudeOrigem) *
        Math.cos(latitudeDestino) *
        Math.sin(diferencaLongitude / 2) ** 2;

    const anguloCentral = 2 * Math.atan2(
        Math.sqrt(haversine),
        Math.sqrt(1 - haversine)
    );

    return raioTerraMetros * anguloCentral;
}

export function calcularDistanciaAcumulada(
    pontos: Coordenada[]
): number {
    let distanciaTotal = 0;

    for (let i = 1; i < pontos.length; i++) {
        distanciaTotal += calcularDistanciaMetros(pontos[i - 1], pontos[i])
    }
    return distanciaTotal;
}

export function calcularPace(distancia: number, duracao: number): ResultadoPace | null {
    if (distancia <= 0 || duracao <= 0) {
        return null
    };
    const distanciaKm = distancia / 1000
    const duracaoMin = duracao / 60000
    const pace = duracaoMin / distanciaKm
    const velocidadeMedia = distanciaKm / (duracao / 3600000)
    return {
        paceMinPorKm: pace,
        velocidadeMediaKmH: velocidadeMedia
    };
}
