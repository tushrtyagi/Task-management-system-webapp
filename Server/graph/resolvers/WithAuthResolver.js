const UserService = require('../../services/UserService');
const ConfigService = require('../../services/ConfigService');


/**
 * Resolve Name Node
 * */
class WithAuthResolver {
    constructor(user, token) {
        this._user = user;
        this.token = token;
        if (!this._user) throw new Error('GS: Invalid Auth Provided. Token not verified.');

        this.ConfigResolver = require('./ConfigResolver');
    }

    async _fullUser() {
        // todo add user resolved
        return await UserService.findOne(this._user.id || this._user._id, this._user);
    }
    _parseCriteria(criteria) {
        if (!criteria) return {};
        try {
            return JSON.parse(criteria);
        } catch (c) {
            throw new Error('Invalid Criteria. ' + c.message);
        }
    }

    async listConfig({criteria, limit, offset}, {data}) {
        const listResp = await ConfigService.list(this._parseCriteria(criteria), limit, offset, await this._fullUser());
        //{docs, total, limit, offset}
        data[`listConfigTotal`] = data.total = listResp.total;
        data[`listConfigLimit`] = data.limit = listResp.limit;
        data[`listConfigOffset`] = data.offset = listResp.offset;
        const user = await this._fullUser();
        return listResp.docs.map(doc => new this.ConfigResolver(doc, user));
    }

    
    async getConfig({id}) {
        const user = await this._fullUser();
        const doc = await ConfigService.findOne(id, user);
        return doc ? new this.ConfigResolver(doc, user) : null;
    }

}

// export
exports = module.exports = WithAuthResolver;
