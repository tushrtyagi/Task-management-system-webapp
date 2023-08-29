/**
 * Meta class for singleton behaviour and pure object implementation
 * */

class JsonAbleSingletonBean {

    /* for preperation of class object safely */
    static get pureObject() {
        if (!this._pinstance) this._pinstance = new this().toJSON();
        return this._pinstance;
    }

    static get bean() {
        if (!this._instance) this._instance = new this();
        return this._instance;
    }

    toJSON(proto) {
        let jsoned = {};
        let toConvert = proto || this;
        Object.getOwnPropertyNames(toConvert).forEach((prop) => {
            const val = toConvert[prop];
            // don't include those
            if (prop === 'toJSON' || prop === 'constructor') {
                return;
            }
            if (typeof val === 'function') {
                jsoned[prop] = val.bind(jsoned);
                return;
            }
            jsoned[prop] = val;
        });

        const inherited = Object.getPrototypeOf(toConvert);
        if (inherited !== null) {
            Object.keys(this.toJSON(inherited)).forEach(key => {
                if (!!jsoned[key] || key === 'constructor' || key === 'toJSON')
                    return;
                if (typeof inherited[key] === 'function') {
                    jsoned[key] = inherited[key].bind(jsoned);
                    return;
                }
                jsoned[key] = inherited[key];
            });
        }
        return jsoned;
    }
}

exports = module.exports = JsonAbleSingletonBean;
