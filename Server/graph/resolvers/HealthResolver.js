/*
* Resolver for type KvPair
*/

class KvPairResolver {

    constructor(data, user) {
        this.data = data;
        this._user = user;
        // Inline imports to avoid cyclic dependency issue
    }

    async isWorking() {
        return true;
    }


}

exports = module.exports = KvPairResolver;

