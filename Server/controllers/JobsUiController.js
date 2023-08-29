const Agendash = require('agendash');
const basicAuth = require('express-basic-auth');

/**
 * For jobs server UI
 * */
exports = module.exports = class JobsUiController {

    constructor(router) {
        // config routes
        router.use('/cams/jobs/ui', /*, todo add security here*/ Agendash(_agenda));
        log.info('Routed', this.constructor.name);
    }
};
