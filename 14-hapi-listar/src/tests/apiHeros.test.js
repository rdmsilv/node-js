const assert = require("assert");
const api = require("./../api");
let app = {};

describe("Suite de testes da Api Heroes", function () {
    this.beforeAll(async () => {
        app = await api;
    });

    it("Lista /herois", async () => {
        const result = await app.inject({
            method: "GET",
            url: "/herois?skip=0&limit=10",
        });

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        assert.deepEqual(statusCode, 200);
        assert.ok(Array.isArray(dados));
    });

    it("Listar /herois - deve retornar somente 3 registros", async () => {
        const TAMANHO_LIMITE = 3;
        const result = await app.inject({
            method: "GET",
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`,
        });

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;
        assert.deepEqual(statusCode, 200);
        assert.ok(dados.length === TAMANHO_LIMITE);
    });

    it("Listar /herois - deve retornar um error com o limit incorreto", async () => {
        const TAMANHO_LIMITE = "AEEE";
        const result = await app.inject({
            method: "GET",
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`,
        })
        assert.deepEqual(result.payload, "Erro interno no servidor");
    });

    it("Listar /herois - deve filtar um item", async () => {
        const NAME = "Pernalonga";
        const result = await app.inject({
            method: "GET",
            url: `/herois?skip=0&limit=1000&nome=${NAME}`,
        });

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;
        assert.deepEqual(statusCode, 200);
        assert.deepEqual(dados[0].nome, NAME);
    });
});