// const UserService = require('../../services/UserService');

/*
* Resolver for type Config
*/

class ConfigResolver {

    constructor(data, user) {
        if (!data) throw new Error('Data is required in resolver');
        this.data = data;
        this._user = user;
        // Inline imports to avoid cyclic dependency issue
        // this.UserResolver = require('./UserResolver');
    }

    async id() {
        return this.data._id;
    }


    async name() {
        return this.data.name;
    }


    async configType() {
        return this.data.configType;
    }


    async value() {
        return this.data.value;
    }


    async selectOptions() {
        return this.data.selectOptions;
    }


    async createdAt() {
        return this.data.createdAt.toString();
    }


    async updatedAt() {
        return this.data.updatedAt.toString();
    }


    async createdBy() {
        // sample , will fail
        const found = await UserService.findOne(this.data.createdBy, this._user);
        return found ? new this.UserResolver(found, this._user) : null;
    }


    async updatedBy() {
        //sample, will fail
        const found = await UserService.findOne(this.data.updatedBy, this._user);
        return found ? new this.UserResolver(found, this._user) : null;
    }


}

exports = module.exports = ConfigResolver;

