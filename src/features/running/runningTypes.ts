export type StatusSessao = "em_andamento" | "pausada" | "finalizada"
export type Sessao = {
    id: number,
    status: StatusSessao,
    dataInicio: number,
    dataFim: number | null,
    distanciaMetros: number,
    duracaoAtivaMs: number,
    paceMedio: number | null,
    velocidadeMediaKmh: number | null
}
export type NovaSessao = Omit<Sessao, "id">

export type SegmentoCorrida = {
    id: number,
    sessaoId: number,
    ordem: number,
    inicioEmMs: number,
    fimEmMs: number | null,
}

export type NovoSegmento = Omit<SegmentoCorrida, "id" | "sessaoId">

export type PontoPercurso = {
    id: number,
    segmentoId: number,
    sequencia: number,
    latitude: number,
    longitude: number,
    precisaoMetros: number,
    horarioEmMs: number

}

export type CorridaIniciada = {
    sessao: NovaSessao,
    segmentoAtual: NovoSegmento

}

