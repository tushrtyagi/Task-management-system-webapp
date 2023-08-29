/**
 * interceptor for user permissions
 * */

class UserPermissionService {

    static get userService() {
        if (this.__UserServiceCache) return this.__UserServiceCache;
        this.__UserServiceCache = require('../UserService');
        return this.__UserServiceCache;
    }

    static async create(id, permission, user, model, searchCriteria, dto) {
        // if (dto && dto.emails && dto.emails.length) {
        //     for (let idx = 0; idx < dto.emails.length; idx++) {
        //         let users = await this.userService.list({"emails.address": dto.emails[idx].address});
        //         if (users && users.docs && users.docs.length) return false;
        //     }
        // }
        return true;
    }

    static async update(id, permission, user, model, searchCriteria, dto) {
        return true;
    }

    static async list(id, permission, user, model, searchCriteria, dto) {
        return true;
    }

    static async fetch(id, permission, user, model, searchCriteria, dto) {
        return true;
    }

    static async count(id, permission, user, model, searchCriteria, dto) {
        return true;
    }

    static async remove(id, permission, user, model, searchCriteria, dto) {
        return true;
    }

}

exports = module.exports = UserPermissionService;
