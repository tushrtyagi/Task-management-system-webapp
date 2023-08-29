/**
 * Resolve Name Node
 * */
class DeleteEntityMutationResolver {
    constructor(user, token) {
        this._user = user;
        this.token = token;
        if (!this._user) throw new Error('Invalid Auth Provided');
        // resolvers
    }

}

// export
exports = module.exports = DeleteEntityMutationResolver;
