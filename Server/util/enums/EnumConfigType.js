/**
 * Enum EnumConfigType
 * */
class EnumConfigType {


    static get BOOLEAN() {
        return 'BOOLEAN'
    }

    static get TEXT() {
        return 'TEXT'
    }

    static get LARGE_TEXT() {
        return 'LARGE_TEXT'
    }

    static get DATETIME() {
        return 'DATETIME'
    }

    static get NUMBER() {
        return 'NUMBER'
    }

    static get SELECT() {
        return 'SELECT'
    }

    static get values() {
        return [this.BOOLEAN, this.TEXT, this.LARGE_TEXT, this.DATETIME, this.NUMBER, this.SELECT];
    }

    static resolve(val) {
        return this[val];
    }
}

exports = module.exports = EnumConfigType;

