const Bean = require('./Bean');

class ConfigDTO extends Bean {

    constructor(...args) {
        super(...args);
        this._payload = args[0] || {};
        this._orig_id = this._payload.id;
        this._orig_name = this._payload.name;
        this._orig_configType = this._payload.configType;
        this._orig_value = this._payload.value;
        this._orig_selectOptions = this._payload.selectOptions;
        this._orig_createdAt = this._payload.createdAt;
        this._orig_updatedAt = this._payload.updatedAt;
        this._orig_createdBy = this._payload.createdBy;
        this._orig_updatedBy = this._payload.updatedBy;
    }

    get id() {
        return this._payload.id;
    }

    set id(id) {
        this._payload.id = id;
    }

    get name() {
        return this._payload.name;
    }

    set name(name) {
        this._payload.name = name;
    }

    get configType() {
        return this._payload.configType;
    }

    set configType(configType) {
        this._payload.configType = configType;
    }

    get value() {
        return this._payload.value;
    }

    set value(value) {
        this._payload.value = value;
    }

    get selectOptions() {
        return this._payload.selectOptions;
    }

    set selectOptions(selectOptions) {
        this._payload.selectOptions = selectOptions;
    }

    get createdAt() {
        return this._payload.createdAt;
    }

    set createdAt(createdAt) {
        this._payload.createdAt = createdAt;
    }

    get updatedAt() {
        return this._payload.updatedAt;
    }

    set updatedAt(updatedAt) {
        this._payload.updatedAt = updatedAt;
    }

    get createdBy() {
        return this._payload.createdBy;
    }

    set createdBy(createdBy) {
        this._payload.createdBy = createdBy;
    }

    get updatedBy() {
        return this._payload.updatedBy;
    }

    set updatedBy(updatedBy) {
        this._payload.updatedBy = updatedBy;
    }

}

exports = module.exports = ConfigDTO;

