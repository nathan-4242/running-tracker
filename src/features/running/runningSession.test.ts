import { iniciarSessao, iniciarSegmento, iniciarCorrida } from "./runningSession"
describe('Teste de início de sessão', () => {
    test("Cria e retorna um object Sessao", () => {
        const dataInicio = 1_790_553_600_000
        const sessao = iniciarSessao(dataInicio)
        expect(sessao.dataInicio).toBe(dataInicio)
        expect(sessao.dataFim).toBeNull()
        expect(sessao.distanciaMetros).toBe(0)
        expect(sessao.duracaoAtivaMs).toBe(0)
        expect(sessao.paceMedio).toBeNull()
        expect(sessao.velocidadeMediaKmh).toBeNull()
        expect(sessao.status).toBe("em_andamento")

    });

    test.each([0, -1, NaN, Infinity, -Infinity])(
        "Rejeita datas de início inválidas -> horario %s", (horario) => {
            const dataInicio = horario
            expect(() => iniciarSessao(dataInicio)).toThrow("Horário de início inválido")
        }
    );
})

describe("Teste de criação de segmento", () => {
    test.each([0, -1, 1.5, NaN, Infinity, -Infinity])(
        "Rejeita nº de ordem inválida -> ordem %s", (ordem) => {
            const num = ordem
            expect(() => iniciarSegmento(1_790_553_600_000, num)).toThrow("Ordem inválida")

        }
    )

    test.each([0, -1, NaN, Infinity, -Infinity])(
        "Rejeita data de início inválida  -> inicio %s", (dataInicio) => {
            const num = dataInicio
            expect(() => iniciarSegmento(num, 1)).toThrow("Horário de início inválido")

        }
    )

    test("Criação válida de segmento", () => {
        const seg = iniciarSegmento(1_790_553_600_000, 1);
        expect(seg.ordem).toBe(1);
        expect(seg.fimEmMs).toBeNull();
        expect(seg.inicioEmMs).toBe(1_790_553_600_000);

    }
    )


})

describe('Validando função iniciarCorrida', () => {
    test("Início de corrida válido", () => {
        const dataInicio = 1_790_553_600_000
        const corrida = iniciarCorrida(dataInicio)
        expect(corrida.sessao.status).toBe("em_andamento")
        expect(corrida.sessao.dataInicio).toBe(dataInicio)
        expect(corrida.sessao.dataFim).toBeNull()
        expect(corrida.segmentoAtual.ordem).toBe(1)
        expect(corrida.segmentoAtual.inicioEmMs).toBe(dataInicio)
        expect(corrida.segmentoAtual.fimEmMs).toBeNull()
    })
})