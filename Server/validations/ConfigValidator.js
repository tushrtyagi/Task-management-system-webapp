const Validator = require('./Validator');

class ConfigValidator extends Validator {

    constructor(...args) {
        super(...args);
    }

    id(id) {
        return false; // return string containing error message to define error, else send any false value.
    }


    name(name) {
        return false; // return string containing error message to define error, else send any false value.
    }


    configType(configType) {
        return false; // return string containing error message to define error, else send any false value.
    }


    value(value) {
        return false; // return string containing error message to define error, else send any false value.
    }


    selectOptions(selectOptions) {
        return false; // return string containing error message to define error, else send any false value.
    }


    createdAt(createdAt) {
        return false; // return string containing error message to define error, else send any false value.
    }


    updatedAt(updatedAt) {
        return false; // return string containing error message to define error, else send any false value.
    }


    createdBy(createdBy) {
        if (createdBy) {
            return _db.Config.convertToObjectId(createdBy) ? false : 'Invalid ID passed for Config->createdBy. Please pass a valid Object id.';
        } else {
            return false;
        }
    }


    updatedBy(updatedBy) {
        if (updatedBy) {
            return _db.Config.convertToObjectId(updatedBy) ? false : 'Invalid ID passed for Config->updatedBy. Please pass a valid Object id.';
        } else {
            return false;
        }
    }


}

exports = module.exports = ConfigValidator;

