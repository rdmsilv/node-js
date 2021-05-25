const ICrud = require('./base/interfaces/interfaceCrud')

class Postgres extends ICrud {
    constructor() {
        super()
    }
    create(item) {
        console.log('O item foi salvo em Postgres');
    }
}

module.exports = Postgres
