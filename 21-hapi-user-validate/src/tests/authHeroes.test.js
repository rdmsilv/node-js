const assert = require("assert");
const { JSON } = require("sequelize");
const api = require("../api");
const Context = require("./../db/strategies/base/contextStrategy");
const Postgres = require("./../db/strategies/postgres/postgres");
const UsuarioSchema = require("./../db/strategies/postgres/schemas/usuarioSchema");

let app = {};
const USER = {
    username: "Amandasilva",
    password: "123",
};
const USER_DB = {
    username: USER.username.toLowerCase(),
    password: " $2b$04$bD1wiexHV1vhi/BEjbLFNOuLG4XfCKxKwIPyiGdjEfW35Wyws2lkm",
};

describe("Auth test suite", function () {
    this.beforeAll(async () => {
        app = await api;

        const connectionPostgres = await Postgres.connect();
        const model = await Postgres.defineModel(
            connectionPostgres,
            UsuarioSchema
        );
        const postgres = new Context(new Postgres(connectionPostgres, model));
        await postgres.update(null, USER_DB, true);
    });

    it("deve obter um token", async () => {
        const result = await app.inject({
            method: "POST",
            url: "/login",
            payload: USER,
        });
        const statusCode = result.statusCode;

        assert.deepStrictEqual(statusCode, 200);
        assert.ok(JSON.parse(result.payload).token.length > 10);
    });

    it("deve retornar não autorizado ao tentar obter um token com login errado", async () => {
        const result = await app.inject({
            method: "POST",
            url: "/login",
            payload: {
                username: "amandasilva",
                password: "123",
            },
        });
        const statusCode = result.statusCode;

        assert.deepStrictEqual(statusCode, 200);
        assert.deepStrictEqual(
            JSON.parse(result.payload).error,
            "Unauthorized"
        );
    });

    it("Deve retornar não autorizado ao tentar obter um login errado", async () => {
        const result = await app.inject({
            method: "POST",
            url: "/login",
            payload: "rudimarsilva",
            password: "123 ",
        });
        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);

        assert.deepStrictEqual(statusCode, 401);
        assert.deepStrictEqual(dados.error, "Unauthorized");
    });
});
