// npm i hapi
// npm i vision inert hapi-swagger
// npm i hapi-auth-jwt2
// npm i bcrypt

const Hapi = require("hapi");
const Context = require("./db/strategies/base/contextStrategy");
const MongoDB = require("./db/strategies/mongodb/mongodb");
const HeroiSchemas = require("./db/strategies/mongodb/schemas/heroisSchemas");
const HeroRoute = require("./routes/heroRoutes");
const AuthRoute = require("./routes/authRoutes");

const Postgres = require("./db/strategies/postgres/postgres");
const UsuarioSchema = require("./db/strategies/postgres/schemas/usuarioSchema");

const HapiSwagger = require("hapi-swagger");
const Vision = require("vision");
const Inert = require("inert");

const HapiJwt = require("hapi-auth-jwt2");
const { isValid } = require("hapi-auth-jwt2/lib/extract");
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

    const connectionPostgres = await Postgres.connect();
    const model = await Postgres.defineModel(connectionPostgres, UsuarioSchema);
    const contextPostgres = new Context(
        new Postgres(connectionPostgres, model)
    );

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

    app.auth.strategy("jwt", "jwt", {
        key: JWT_SECRET,
        // options: {
        // expiresIn: 20
        // },
        validate: async (dados, request) => {
            const [result] = await contextPostgres.read({
                username: dados.username.toLowerCase(),
                id: dados.id,
            });
            if (!result) {
                return { isValid: false };
            }
            // Verifica no banco se o usuario continua ativo
            // Verifica no banco se o usuario continua pagando

            return {
                isValid: true, //Caso não valido false
            };
        },
    });
    app.auth.default("jwt");

    app.route([
        ...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
        ...mapRoutes(
            new AuthRoute(JWT_SECRET, contextPostgres),
            AuthRoute.methods()
        ),
    ]);

    await app.start();
    console.log("Servidor Rodando na porta:", app.info.port);

    return app;
}
module.exports = main();
