/**
 * exposed commom caching functions
 * */

exports = module.exports = class CacheAbleService {

    static async executeCache(keyTmpl, keyModel, action, ...params) {
        return await _db.cache[action](this._buildKey(keyTmpl, keyModel), ...params);
    }

    static _buildKey(tmpl, model) {
        Object.keys(model).forEach(key => {
            tmpl = tmpl.replace(new RegExp("\\{" + key + "\\}", 'g'), model[key]);
        });
        return tmpl;
    }
};
