const ICrud = require('./base/interfaceCrud')
const Sequelize = require('sequelize')
class PostgreSQLConnection {
    static connect() {}
  }
class Postgres extends ICrud {
    constructor() {
        super();
        this._sequelize = null,
        this._herois = null
    }

    async defineModel() {
        this._herois = this._sequelize.define(
            'herois',
            {
            id: {
                type: Sequelize.INTEGER,
                required: true,
                primaryKey: true,
                autoIncrement: true
            },

            nome: {
                type: Sequelize.STRING,
                required: true
            },

            poder: {
                type: Sequelize.STRING,
                required: true
            }
        },
        {
            tableName: 'TB_HEROIS',
            freezeTableName: false,
            timestamps: false
        },
        );
        await this._herois.sync()
    }

    _connect() {
        this._sequelize = new Sequelize(
            'heroes',
            'rudimarsilva',
            'ananda1902',{
                host: 'localhost',
                dialect: 'postgres',
                quoteIdentifiers: false,
                operatorsAliases: false
            }
        )
        this.defineModel();
    }


    async isConnected() {
        try {
            await this._sequelize.authenticate();
            return true;
        } catch (error) {
            console.log('fail!', error);
            return false;
        }
    }

    async create(item) {
        const {
            dataValues
        } = this._herois.create(item, { raw: true });
        return dataValues
      }

     async read(query = {}) {
       return this._herois.findAll({ where: query, raw: true });
      }

     async update(id, item) {
        return this._herois.update(item, { where: { id } });
      }
    async delete(id) {
        const query = id ? { id } : {};
        return this._herois.destroy({ where: query });
      }
}

module.exports = Postgres
