/*
* Resolver for type KvPair
*/

class KvPairResolver {

    constructor(data, user) {
        if (!data) throw new Error('Data is required in resolver');
        this.data = data;
        this._user = user;
        // Inline imports to avoid cyclic dependency issue
    }

    async val() {
        return this.data.val;
    }


    async key() {
        return this.data.key;
    }


}

exports = module.exports = KvPairResolver;

