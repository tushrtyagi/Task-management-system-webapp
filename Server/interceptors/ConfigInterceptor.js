/**
 * Interceptor for data manipulation for entity Config
 * */

class ConfigInterceptor {

    static async beforeConfigCreate(refConfigDto, user) {
        // feel free to change the DTO for manipulation before save
    }

    static async beforeConfigUpdate(refConfigUpdateDto, refConfigOrigObj, user) {
        // feel free to change the Dto for manipulation before update
    }

    static async beforeConfigDelete(id, user) {
        // throw error here to stop deletion, or do actions necessary before deletion.
    }

    static async afterConfigFind(id, foundConfig, user) {
        // manipulate and return the object you want to return back in API.
        return foundConfig;
    }

    static async afterConfigList(criteria, foundConfigItems, limit, offset, total, user) {
        // manipulate and return the objects you want to return back in API.
        return foundConfigItems;
    }

    static async beforeConfigList(refCriteriaObj, limit, offset, user) {
        // manipulate query refCriteriaObj as desired for listing. This is a mongoDB query.
    }

}

exports = module.exports = ConfigInterceptor;
