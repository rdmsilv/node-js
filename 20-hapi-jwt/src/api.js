// npm i hapi
// npm i vision inert hapi-swagger

const Hapi = require("hapi");
const Context = require("./db/strategies/base/contextStrategy");
const MongoDB = require("./db/strategies/mongodb/mongodb");
const HeroiSchemas = require("./db/strategies/mongodb/schemas/heroisSchemas");
const HeroRoute = require("./routes/heroRoutes");
const AuthRoute = require("./routes/authRoutes");

const HapiSwagger = require("hapi-swagger");
const Vision = require("vision");
const Inert = require("inert");

const HapiJwt = require("hapi-auth-jwt2");
const JWT_SECRET = "MEU_SEGREDÃO_123";

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
            title: "API Herois - #CursoNodeBR",
            version: "v1.0",
        },
        lang: "pt",
    };
    await app.register([
        HapiJwt,
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions,
        },
    ]);

    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        // options: {
        // expiresIn: 20
        // },
        validate: (dados, request) => {
            // Verifica no banco se o usuario continua ativo
            // Verifica no banco se o usuario continua pagando

            return {
                isValid: true //Caso não valido false
            }
        }

     })
     app.auth.default('jwt')

    app.route([
        ...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
        ...mapRoutes(new AuthRoute(JWT_SECRET), AuthRoute.methods()),
    ]);

    await app.start();
    console.log("Servidor Rodando na porta:", app.info.port);

    return app;
}
module.exports = main();
