const JsonAbleSingletonBean = require('./JsonAbleSingletonBean');

/**
 * Helper functions for mapper
 * */

class MapperHelper extends JsonAbleSingletonBean {
    /* Helper methods here*/
    hello(str) {
        return `Hello: ${str}`;
    }


}

exports = module.exports = MapperHelper.pureObject;
