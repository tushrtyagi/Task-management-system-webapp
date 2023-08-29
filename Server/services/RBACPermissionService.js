/**
 * Manage Object level permissions
 * */
const UserPermissionService = require('./permissions/UserPermissionService');

class RBACPermissionService {

    static async check(id, permission, user, model, searchCriteria, dto) {
        // todo implement
        // return false if no permission
        let [subAction, entity] = permission.split('.');
        switch (entity) {
            case 'User':
                return await UserPermissionService[subAction](id, permission, user, model, searchCriteria, dto);
            default:
                return true;
        }
    }

}

exports = module.exports = RBACPermissionService;
