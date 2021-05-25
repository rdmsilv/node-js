// npm i hapi

const Hapi = require("hapi");
const Context = require("./db/strategies/base/contextStrategy");
const MongoDB = require("./db/strategies/mongodb/mongodb");
const HeroiSchemas = require("./db/strategies/mongodb/schemas/heroisSchemas");

const app = new Hapi.Server({
    port: 5000,
});

async function main() {
    const connection = MongoDB.connect();
    const context = new Context(new MongoDB(connection, HeroiSchemas));

    app.route([
        {
            path: "/herois",
            method: "GET",
            handler: (request, head) => {
                return context.read();
            },
        },
    ]);

    await app.start();
    console.log("Servidor Rodando na porta:", app.info.port);
}
main();
