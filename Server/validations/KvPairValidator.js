const Validator = require('./Validator');

class KvPairValidator extends Validator {

    constructor(...args) {
        super(...args);
    }

    val(val) {
        return false; // return string containing error message to define error, else send any false value.
    }


    key(key) {
        return false; // return string containing error message to define error, else send any false value.
    }


}

exports = module.exports = KvPairValidator;

