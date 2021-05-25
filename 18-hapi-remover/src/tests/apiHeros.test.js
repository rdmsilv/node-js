const assert = require("assert");
const api = require("./../api");
let app = {};

const MOCK_HEROI_CADASTRAR = {
    nome: "Chapolin Colorado",
    poder: "Marreta Biônica",
};

const MOCK_HEROIS_INICIAL = {
    nome: "Gavião Negro",
    poder: "A mira",
};

let MOCK_ID = "";

describe.only("Suite de testes da Api Heroes", function () {
    this.beforeAll(async () => {
        app = await api;
        const result = await app.inject({
            method: "POST",
            url: "/herois",
            payload: JSON.stringify(MOCK_HEROIS_INICIAL),
        });

        const dados = JSON.parse(result.payload);
        MOCK_ID = dados._id;
    });

    it("Lista /herois", async () => {
        const result = await app.inject({
            method: "GET",
            url: "/herois?skip=0&limit=10",
        });

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        assert.deepStrictEqual(statusCode, 200);
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
        assert.deepStrictEqual(statusCode, 200);
        assert.ok(dados.length === TAMANHO_LIMITE);
    });

    it("Listar /herois - deve retornar um error com o limit incorreto", async () => {
        const TAMANHO_LIMITE = "AEEE";
        const result = await app.inject({
            method: "GET",
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`,
        });
        const errorResult = {
            statusCode: 400,
            error: "Bad Request",
            message: 'child "limit" fails because ["limit" must be a number]',
            validation: { source: "query", keys: ["limit"] },
        };
        // assert.deepStrictEqual(result.statusCode, 400);
        // assert.deepStrictEqual(result.payload, JSON).stringify(errorResult);
    });

    it("Listar /herois - deve filtar um item", async () => {
        const NAME = "Pernalonga";
        const result = await app.inject({
            method: "GET",
            url: `/herois?skip=0&limit=1000&nome=${NAME}`,
        });

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;
        // assert.deepStrictEqual(statusCode, 200);
        // assert.deepStrictEqual(dados[0].nome, NAME);
    });

    it("Cadastrar  POST /herois", async () => {
        const result = await app.inject({
            method: "POST",
            url: `/herois`,
            payload: JSON.stringify(MOCK_HEROI_CADASTRAR),
        });
        const statusCode = result.statusCode;
        const { message, _id } = JSON.parse(result.payload);
        assert.ok(statusCode === 200);
        assert.notStrictEqual(_id, undefined);
        assert.deepStrictEqual(message, "Heroi cadastrado com sucesso!");
    });

    it("Atualizar PATCH - /herois/:id", async () => {
        const _id = MOCK_ID;
        const expected = {
            poder: "Super Mira",
        };

        const result = await app.inject({
            method: "PATCH",
            url: `/herois/${_id}`,
            payload: JSON.stringify(expected),
        });
        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);

        assert.ok(statusCode === 200);
        assert.deepStrictEqual(
            dados.message,
            "Herois atualizado com sucesso !!!"
        );
    });

    it("Atualizar PATCH - /herois/:id - Não deve atualizar com ID incorreto!", async () => {
        const _id = `60a851dd3191ca72c06a3909`;
        const result = await app.inject({
            method: "PATCH",
            url: `/herois/${_id}`,
            payload: JSON.stringify( {
                poder: "Super Mira",
            }),
        });
        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);
        const expected = {
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'Id não encontrado no banco!'
          }
        assert.ok(statusCode === 412);
        assert.deepStrictEqual(dados, expected);
    });

    it("Remover DELETE - /herois/:id", async () => {
        const _id = MOCK_ID;
        const result = await app.inject({
            method: "DELETE",
            url: `/herois/${_id}`,
        });
        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);

        assert.ok(statusCode === 200);
        assert.deepStrictEqual(dados.message, "Heroi Removido com Sucesso!");
    });

    it("Remover DELETE - /herois/:id não deve remover", async () => {
        const _id = '60a851dd3191ca72c06a3909';
        const result = await app.inject({
            method: "DELETE",
            url: `/herois/${_id}`,
        });
        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);
        const expected = {
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'Id não encontrado no banco!'
          }
        assert.ok(statusCode === 412);
        assert.deepStrictEqual(dados, expected);
    });

    it("Remover DELETE - /herois/:id não deve remover com id invalido", async () => {
        const _id = 'ID_IVALIDO';
        const result = await app.inject({
            method: "DELETE",
            url: `/herois/${_id}`,
        });
        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);
        const expected = {
            statusCode: 500,
            "error": "Internal Server Error",
            "message": "An internal server error occurred"

          }
        assert.ok(statusCode === 500);
        assert.deepStrictEqual(dados, expected);
    });
});
