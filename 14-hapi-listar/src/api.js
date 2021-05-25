// npm i hapi

const Hapi = require("hapi");
const Context = require("./db/strategies/base/contextStrategy");
const MongoDB = require("./db/strategies/mongodb/mongodb");
const HeroiSchemas = require("./db/strategies/mongodb/schemas/heroisSchemas");
const HeroRoute = require("./routes/heroRoutes");

const app = new Hapi.Server({
    port: 5000,
});

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    const connection = MongoDB.connect();
    const context = new Context(new MongoDB(connection, HeroiSchemas));
   
    app.route([
        ...mapRoutes(new HeroRoute(context), HeroRoute.methods())
    ]);

    await app.start();
    console.log("Servidor Rodando na porta:", app.info.port);

    return app;
}
module.exports = main();
