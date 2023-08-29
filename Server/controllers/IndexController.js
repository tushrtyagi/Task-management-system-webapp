const Agendash = require('agendash');
const basicAuth = require('express-basic-auth');

/**
 * For jobs server UI
 * */
exports = module.exports = class IndexController {

    constructor(router) {
        // config routes
        router.get('/', this.indexPage);
        log.info('Routed', this.constructor.name);
    }

    async indexPage(req, res){
        return res.render('index', {time: new Date()});
    }
};
