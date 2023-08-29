const JsonAbleSingletonBean = require('../JsonAbleSingletonBean');

/**
 * Superclass for beans
 * */
class Bean extends JsonAbleSingletonBean {

    constructor(...args) {
        super();
        this._payload = {};
    }

    toJSON() {
        return super.toJSON(this._payload);
    }

    toObject() {
        return JSON.parse(JSON.stringify(this._payload));
    }

    createTrack(userId) {
        if (!this.createdBy) this.createdBy = userId
        this.updatedBy = userId;
        if (!this.createdAt) this.createdAt = +new Date();
        this.updatedAt = +new Date();
    }

}

exports = module.exports = Bean;
