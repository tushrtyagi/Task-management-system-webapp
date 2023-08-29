const CONSTANTS = require('../util/Constants');
const ConfigDTO = require('../util/beans/ConfigDTO');
const ConfigValidator = require('../validations/ConfigValidator');
const ConfigHook = require('../hooks/ConfigHook');
const ConfigInterceptor = require('../interceptors/ConfigInterceptor');
const RBACPermissionService = require('./RBACPermissionService');


/**
 * This service provide logical operations over Config Model
 * */

class ConfigService {

    static async findOne(id, user = null) {
        if (!(await RBACPermissionService.check(id, 'fetch.Config', user, _db.Config, null, null))) throw new Error('You do not have permission to do this operation');
        // validate
        if (!id) return null;
        const _id = id;
        id = _db.Config.convertToObjectId(id);
        if (!id) throw new Error('Invalid ID passed to fetch Config. ' + _id);

        // fetch
        const foundConfig = await _db.Config.findOne({_id: id});
        return await ConfigInterceptor.afterConfigFind(id, foundConfig, user);
    }

    static async remove(id, user = null) {
        if (!(await RBACPermissionService.check(id, 'remove.Config', user, _db.Config, null, null))) throw new Error('You do not have permission to do this operation');
        // validate
        if (!id) throw new Error('Please provide an Id to delete.');
        const _id = id;
        id = _db.Config.convertToObjectId(id);
        if (!id) throw new Error('Invalid ID passed to delete Config. ' + _id);

        // remove
        await ConfigInterceptor.beforeConfigDelete(id, user);
        ConfigHook.trigger('onConfigDelete', id);
        return await _db.Config.findOneAndRemove({_id: id});
    }

    static async list(criteria = {}, limit = 10, offset = 0, user = null) {
        if (!(await RBACPermissionService.check(null, 'list.Config', user, _db.Config, criteria, null))) throw new Error('You do not have permission to do this operation');
        // Set max limit
        if (limit && limit > CONSTANTS.MAX_LIMIT) limit = CONSTANTS.MAX_LIMIT;

        // injection safety
        criteria = JSON.parse(JSON.stringify(criteria));

        // intercept query
        await ConfigInterceptor.beforeConfigList(criteria, limit, offset, user);

        // Fetch Total
        const total = await _db.Config.count(criteria);

        // Fetch
        const docs = total ? (await _db.Config.find(criteria).skip(offset).limit(limit)) : [];
        return {
            docs: (await ConfigInterceptor.afterConfigList(criteria, docs, limit, offset, total, user)),
            total,
            limit,
            offset
        };
    }

    static async count(criteria = {}, user = null) {
        if (!(await RBACPermissionService.check(null, 'count.Config', user, _db.Config, criteria, null))) throw new Error('You do not have permission to do this operation');
        criteria = JSON.parse(JSON.stringify(criteria)); // injection safety
        return await _db.Config.count(criteria);
    }

    static async create(dto, user = null) {
        if (!(await RBACPermissionService.check(null, 'create.Config', user, _db.Config, null, dto))) throw new Error('You do not have permission to do this operation');
        if (!(dto instanceof ConfigDTO)) throw new Error('Please provide a ConfigDTO to create the Config.');

        // enrich
        dto.createTrack(user && user._id || user.id || null);
        await ConfigInterceptor.beforeConfigCreate(dto, user);

        // check data
        const obj = dto.toObject();
        const validationResult = new ConfigValidator(obj, true).validate();
        if (!validationResult.isValid) {
            throw new Error('Validation Failure for Config: ' + validationResult.errorString);
        }

        // save
        const dbObj = new _db.Config(obj);
        const saveResp = await dbObj.save();
        ConfigHook.trigger('onConfigCreate', saveResp);
        return saveResp;
    }

    static async update(id, dto, user = null) {
        if (!(await RBACPermissionService.check(id, 'update.Config', user, _db.Config, null, dto))) throw new Error('You do not have permission to do this operation');
        // validate
        if (!id) throw new Error('Please provide an Id to update.');
        const _id = id;
        id = _db.Config.convertToObjectId(id);
        if (!id) throw new Error('Invalid ID passed to update Config. ' + _id);

        // Fetch original object
        const origDbObj = await _db.Config.findOne({_id: id});
        if (!origDbObj) throw new Error('No object with provided id: ' + id);

        // validate DTO
        if (!(dto instanceof ConfigDTO)) throw new Error('Please provide a ConfigDTO to update the Config.');

        // enrich
        dto.createTrack(user && user._id || user.id || null);
        await ConfigInterceptor.beforeConfigUpdate(dto, origDbObj, user);

        // Check data
        const obj = dto.toObject();
        const validationResult = new ConfigValidator(obj, origDbObj, false).validate();
        if (!validationResult.isValid) {
            throw new Error('Validation Failure for Config: ' + validationResult.errorString);
        }

        // update
        const updateResult = await _db.Config.update({_id: id}, {$set: obj});

        // fetch latest
        const updatedDbObj = await _db.Config.findOne({_id: id});
        ConfigHook.trigger('onConfigUpdate', {oldObj: origDbObj, newObj: updatedDbObj});

        return {updateResult, updatedDbObj};

    }

}

exports = module.exports = ConfigService;


