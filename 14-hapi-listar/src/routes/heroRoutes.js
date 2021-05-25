const BaseRoute = require("./base/baseRoute");

class HeroRoutes extends BaseRoute {
    constructor(db) {
        super();
        this.db = db;
    }

    list() {
        return {
            path: "/herois",
            method: "GET",
            handler: (request, headers) => {
                try {
                    const { skip, limit, nome } = request.query;

                    console.log("limit", limit);
                    let query = {};
                    if (nome) {
                        query.nome = nome;
                    }

                    if (isNaN(skip) && skip)
                        throw Error("O tipo do skip estar incorretto");

                    if (isNaN(limit))
                        throw Error("O tipo do limit estar incorretto");

                    return this.db.read(query, parseInt(skip), parseInt(limit));
                } catch (error) {
                    console.log("DEU RUIM", error);
                    return "Erro interno do servidor";
                }
            },
        };
    }
}

module.exports = HeroRoutes;
