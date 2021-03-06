// npm i hapi
// npm i vision inert hapi-swagger

const Hapi = require("hapi");
const Context = require("./db/strategies/base/contextStrategy");
const MongoDB = require("./db/strategies/mongodb/mongodb");
const HeroiSchemas = require("./db/strategies/mongodb/schemas/heroisSchemas");
const HeroRoute = require("./routes/heroRoutes");

const HapiSwagger = require('hapi-swagger')
const Vision = require('vision')
const Inert = require('inert')

const app = new Hapi.Server({
    port: 5000,
});

function mapRoutes(instance, methods) {
    return methods.map((method) => instance[method]());
}

async function main() {
    const connection = MongoDB.connect();
    const context = new Context(new MongoDB(connection, HeroiSchemas));

    const swaggerOptions = {
        info: {
            title: 'API Herois - #CursoNodeBR',
            version: 'v1.0'
        },
        lang: 'pt'
    }
    await app.register([
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ])

    app.route(mapRoutes(new HeroRoute(context), HeroRoute.methods()));

    await app.start();
    console.log("Servidor Rodando na porta:", app.info.port);

    return app;
}
module.exports = main();
