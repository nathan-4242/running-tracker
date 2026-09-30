import type { CorridaIniciada, NovaSessao, NovoSegmento } from "./runningTypes"

export function iniciarSessao(dataInicio: number): NovaSessao {
    if (Number.isFinite(dataInicio) && dataInicio > 0) {
        const novaSessao: NovaSessao = {
            status: "em_andamento",
            dataInicio: dataInicio,
            dataFim: null,
            distanciaMetros: 0,
            duracaoAtivaMs: 0,
            paceMedio: null,
            velocidadeMediaKmh: null
        }
        return novaSessao
    } else {
        throw new Error("Horário de início inválido")
    }
}

export function iniciarSegmento(inicioEmMs: number, ordem: number): NovoSegmento {
    if (Number.isFinite(inicioEmMs) && inicioEmMs > 0) {
        if (Number.isInteger(ordem) && ordem > 0) {
            const novoSegmento: NovoSegmento = {
                ordem,
                inicioEmMs,
                fimEmMs: null,
            }
            return novoSegmento
        } else { throw new Error("Ordem inválida") }
    } else {
        throw new Error("Horário de início inválido")
    }
}

export function iniciarCorrida(dataInicio: number): CorridaIniciada {
    const corridaIniciada = {
        sessao: iniciarSessao(dataInicio),
        segmentoAtual: iniciarSegmento(dataInicio, 1)
    }
    return corridaIniciada
}