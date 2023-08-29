const Bean = require('./Bean');

class KvPairDTO extends Bean {

    constructor(...args) {
        super(...args);
        this._payload = args[0] || {};
        this._orig_val = this._payload.val;
        this._orig_key = this._payload.key;
    }

    get val() {
        return this._payload.val;
    }

    set val(val) {
        this._payload.val = val;
    }

    get key() {
        return this._payload.key;
    }

    set key(key) {
        this._payload.key = key;
    }

}

exports = module.exports = KvPairDTO;

