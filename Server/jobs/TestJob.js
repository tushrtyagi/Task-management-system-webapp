/**
 * Defines a sample Job descriptor
 * Runs on cluster and are controlled mutually exclusive.
 * */

// job
module.exports = class TestJob {

    static get trigger() {
        // return "0/5 * * * *"; // every 5 secs, human time or cron both accepted
        return "5 seconds"; // every 5 secs, human time or cron both accepted
    }

    static get concurrency() {
        return 1;
    }

    static get priority() {
        return 'normal'; //(lowest|low|normal|high|highest|number)
    }

    static async task(job) {
        // log.trace('Running Job', this.name);
    }
};
