const EventEmitter = require('events');

/**
 * Base class to define a hook
 * */
class Hook extends EventEmitter {

    constructor() {
        super();
        this.on('event', this.onEvent);
    }

    static trigger(event, data) {
        this._instance.emit('event', {event, data: data || {}});
    }

    static get _instance() {
        if (!this.__instance) this.__instance = new this();
        return this.__instance;
    }

}


exports = module.exports = Hook;
