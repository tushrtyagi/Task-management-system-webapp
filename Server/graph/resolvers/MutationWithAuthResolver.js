/**
 * Resolve Name Node
 * */
class MutationWithAuthResolver {
    constructor(user, token) {
        this._user = user;
        this.token = token;
        if (!this._user) throw new Error('Invalid Auth Provided');
        // resolvers
        this.FabricateEntityMutationResolver = require('./FabricateEntityMutationResolver');
        this.UpdateEntityMutationResolver = require('./UpdateEntityMutationResolver');
        this.DeleteEntityMutationResolver = require('./DeleteEntityMutationResolver');
    }

    fabricate() {
        return new this.FabricateEntityMutationResolver(this._user, this.token);
    }


    update() {
        return new this.UpdateEntityMutationResolver(this._user, this.token);
    }


    del() {
        return new this.DeleteEntityMutationResolver(this._user, this.token);
    }
}

// export
exports = module.exports = MutationWithAuthResolver;
