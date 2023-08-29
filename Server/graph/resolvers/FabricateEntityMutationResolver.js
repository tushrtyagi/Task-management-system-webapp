// DTO
const ConfigDTO = require('../../util/beans/ConfigDTO');
// services
const ConfigService = require('../../services/ConfigService');

/**
 * Resolve Name Node
 * */
class FabricateEntityMutationResolver {
    constructor(user, token) {
        this._user = user;
        this.token = token;
        if (!this._user) throw new Error('Invalid Auth Provided');
        // resolvers
        this.ConfigResolver = require('./ConfigResolver');
    }

    async createConfig({name, configType, value, selectOptions, createdAt, updatedAt, createdBy, updatedBy}) {
        const dto = new ConfigDTO({name, configType, value, selectOptions, createdAt, updatedAt, createdBy, updatedBy});
        const doc = await ConfigService.create(dto, this._user);
        return doc ? new this.ConfigResolver(doc, this._user) : null;
    }

}

// export
exports = module.exports = FabricateEntityMutationResolver;
