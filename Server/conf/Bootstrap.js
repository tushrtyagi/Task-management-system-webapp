/**
 * bootstrap class runs once app is started
 * */
exports = module.exports = class Bootstrap {

    constructor(app) {
        this.app = app;
        return this.run();
    }

    async run() {
        await this.fetchConfig();
    }

    async fetchConfig() {
        log.trace(_config);
    }


}
