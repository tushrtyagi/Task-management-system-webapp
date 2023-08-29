const async = require('async');

exports = module.exports = class AsyncUtils {

    static async forkJoinAll(dataArr, handlerAsync, limit = 10) {
        return new Promise((res, rej) => {
            async.mapLimit(dataArr, limit, async function (data) {
                return (await handlerAsync(data) || []);
            }, (err, resp) => {
                if (err) {
                    log.error(err);
                    rej(err);
                } else {
                    res(resp);
                }
            });
        });
    }

};
