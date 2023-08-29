const Hook = require('./base/Hook');

/**
 * Hook to run lifecycle events for entity Config
 * */

class ConfigHook extends Hook {

    onEvent({event, data}) {
        console.log('Triggered hook', this.constructor.name, event, data);
        this[event](data);
    }

    onConfigCreate(newObj) {
        // called when Config is created.
    }

    onConfigUpdate({oldObj, newObj}) {
        // called when Config is updated.
    }

    onConfigDelete(id) {
        // called when Config is deleted.
    }

}

exports = module.exports = ConfigHook;
