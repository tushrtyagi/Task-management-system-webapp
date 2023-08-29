const Agendash = require('agendash');
const basicAuth = require('express-basic-auth');

/**
 * For jobs server UI
 * */
exports = module.exports = class DemoController {

    constructor(router) {
        // config routes
        router.get('/demo/test', this.testEjs);
        log.info('Routed', this.constructor.name);
    }

    async testEjs(req, res){
        return res.render('yo', {name: 'World!'});
    }
};
