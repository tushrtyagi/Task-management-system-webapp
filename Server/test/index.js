/**
 * Very simple test case Runner
 * */


new class Test {

    constructor() {
        let [, , cmd, ...args] = process.argv;
        cmd = cmd || 'all';
        this[cmd] && this[cmd].apply(this, args) || console.log('Unknown test', cmd);
    }

    async all() {
        console.log('todo implement all test');
    }

    async _initApp() {
        return new Promise((res) => {
            require('../app');
            setTimeout(() => res(), 5000);
        });
    }

    destroyApp() {
        process.exit(0);
    }


};
