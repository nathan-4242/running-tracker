import { calcularDistanciaMetros, coordenadaValida, calcularDistanciaAcumulada, calcularPace, Coordenada } from "./runningLogic";

describe("coordenadaValida", () => {

    test.each<[keyof Coordenada, number]>([["latitude", Infinity], ["longitude", NaN], ["precisao", -Infinity], ["horario", NaN],])(
        "Rejeita valores não finitos - %s: %s", (campo, valorInvalido) => {
            const coordenada = {
                latitude: -23.55,
                longitude: -46.63,
                precisao: 5,
                horario: 1_700_000_000_000,
            };
            coordenada[campo] = valorInvalido
            const resultado = coordenadaValida(coordenada)
            expect(resultado.valido).toBe(false)
            expect(resultado.motivo).toBe("A coordenada possui valores inválidos não finitos")
        }

    )

    test.each([0, -1])(
        "Rejeita uma captura de horário inválida: %s",
        (horario) => {
            const coordenada = {
                latitude: -23.55,
                longitude: -46.63,
                precisao: 5,
                horario,
            };
            const resultado = coordenadaValida(coordenada)

            expect(resultado.valido).toBe(false);
            expect(resultado.motivo).toBe("Horário de captura inválido");

        }
    )

    test("Aceita precisão = 20", () => {
        const coordenada = {
            latitude: 90,
            longitude: -46.63,
            precisao: 20,
            horario: 1_700_000_000_000,
        }
        const resultado = coordenadaValida(coordenada);
        expect(resultado.valido).toBe(true)
    })
    test("Rejeita precisão >  20", () => {
        const coordenada = {
            latitude: 90,
            longitude: -46.63,
            precisao: 21,
            horario: 1_700_000_000_000,
        }
        const resultado = coordenadaValida(coordenada);
        expect(resultado.valido).toBe(false)
        expect(resultado.motivo).toBe("Precisão inválida")
    })
    test("Aceita precisão =  0", () => {
        const coordenada = {
            latitude: 90,
            longitude: -46.63,
            precisao: 0,
            horario: 1_700_000_000_000,
        }
        const resultado = coordenadaValida(coordenada);
        expect(resultado.valido).toBe(true)
    })
    test("Rejeita precisão menor que 0", () => {
        const coordenada = {
            latitude: 90,
            longitude: -46.63,
            precisao: -2,
            horario: 1_700_000_000_000,
        }
        const resultado = coordenadaValida(coordenada);
        expect(resultado.valido).toBe(false)
        expect(resultado.motivo).toBe("Precisão inválida");
    })
    test.each([181, -181])(
        "Rejeita uma longitude inválida: %s",
        (longitude) => {
            const coordenada = {
                latitude: -23.55,
                longitude: longitude,
                precisao: 5,
                horario: 1_700_000_000_000,
            };
            const resultado = coordenadaValida(coordenada)

            expect(resultado.valido).toBe(false);
            expect(resultado.motivo).toBe("Longitude inválida");

        }
    )
    test("Rejeita latitude menor que -90º", () => {
        const coordenada = {
            latitude: -91,
            longitude: -46.63,
            precisao: 5,
            horario: 1_700_000_000_000,
        }
        const resultado = coordenadaValida(coordenada);
        expect(resultado.valido).toBe(false)
        expect(resultado.motivo).toBe("Latitude inválida");
    })
    test("Rejeita latitude acima de 90º", () => {
        const coordenada = {
            latitude: 91,
            longitude: -46.63,
            precisao: 5,
            horario: 1_700_000_000_000,
        }
        const resultado = coordenadaValida(coordenada);
        expect(resultado.valido).toBe(false)
        expect(resultado.motivo).toBe("Latitude inválida");
    })
    test("Aceita uma coordenada válida", () => {
        const coordenada = {
            latitude: -23.55,
            longitude: -46.63,
            precisao: 5,
            horario: 1_700_000_000_000,
        }

        const resultado = coordenadaValida(coordenada);
        expect(resultado.valido).toBe(true)
    })
})

describe("calcularDistânciaMetros", () => {
    test("Retorna zero para dois pontos iguais", () => {
        const ponto = {
            latitude: -23.5505,
            longitude: -46.6333,
            precisao: 5,
            horario: 1_700_000_000_000
        }
        const distancia = calcularDistanciaMetros(ponto, ponto);
        expect(distancia).toBe(0)
    })


    test("Retorna uma distância válida entre dois pontos diferentes", () => {
        const origem = {
            latitude: -7.2020955,
            longitude: -34.8428278,
            precisao: 5,
            horario: 1_700_000_000_000
        }
        const destino = {
            latitude: - 7.1215538,
            longitude: -34.8837855,
            precisao: 5,
            horario: 1_700_000_000_000
        }
        const distancia = calcularDistanciaMetros(origem, destino);
        expect(distancia).toBeGreaterThan(10_000)
        expect(distancia).toBeLessThan(10_100)
    })

})

describe('calcularDistanciaAcumulada', () => {
    test("Retorna zero para uma lista vazia", () => {
        const distAc = calcularDistanciaAcumulada([])
        expect(distAc).toBe(0)
    })
    test("Retorna zero para uma lista com apenas um ponto", () => {
        const ponto = {
            latitude: -7.2020955,
            longitude: -34.8428278,
            precisao: 5,
            horario: 1_700_000_000_000
        }
        const distAc = calcularDistanciaAcumulada([ponto]);
        expect(distAc).toBe(0);
    })
    test("Retorna uma distância acumulada válida para mais de um ponto", () => {
        const pontoA = {
            latitude: 0,
            longitude: 0,
            precisao: 5,
            horario: 1_700_000_000_000
        }

        const pontoB = {
            latitude: 0,
            longitude: 1,
            precisao: 5,
            horario: 1_700_000_001_000
        }

        const pontoC = {
            latitude: 0,
            longitude: 2,
            precisao: 5,
            horario: 1_700_000_002_000
        }
        const distAc = calcularDistanciaAcumulada([pontoA, pontoB, pontoC]);
        expect(distAc).toBeGreaterThan(222_000)
        expect(distAc).toBeLessThan(222_600)

    })

})

describe('calcularPace', () => {
    test("Calcula pace e velocidade média", () => {
        const distancia = 5_000
        const duracao = 1_800_000

        const resultado = calcularPace(distancia, duracao);
        expect(resultado).toEqual({
            paceMinPorKm: 6,
            velocidadeMediaKmH: 10
        })
    })
})

describe('Teste calcularPace null', () => {
    test.each([[0, 60_000],
    [-1, 60_000],
    [1_000, 0],
    [1_000, -1]
    ])(
        "Retorna null para distância %s e duração %s",
        (distancia, duracao) => {
            const resultado = calcularPace(distancia, duracao)
            expect(resultado).toBe(null)
        }
    )
})
