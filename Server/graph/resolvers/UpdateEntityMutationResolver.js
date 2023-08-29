// DTO
const ConfigDTO = require('../../util/beans/ConfigDTO');
// services
const ConfigService = require('../../services/ConfigService');

/**
 * UpdateEntityMutationResolver
 * */
class UpdateEntityMutationResolver {
    constructor(user, token) {
        this._user = user;
        this.token = token;
        if (!this._user) throw new Error('Invalid Auth Provided');
        // resolvers
        this.ConfigResolver = require('./ConfigResolver');
    }

    async updateConfig({id, name, configType, value, selectOptions, createdAt, updatedAt, createdBy, updatedBy}, {data}) {
        const dto = new ConfigDTO({name, configType, value, selectOptions, createdAt, updatedAt, createdBy, updatedBy});
        const result = await ConfigService.update(id, dto, this._user); //{updateResult, updatedDbObj}
        if (result && result.updateResult) {
            data.updateResult = result.updateResult;
            data.updateResult_Config = result.updateResult;
            return new this.ConfigResolver(result.updatedDbObj, this._user);
        } else throw new Error('Unable to update');
    }
}

// export
exports = module.exports = UpdateEntityMutationResolver;
