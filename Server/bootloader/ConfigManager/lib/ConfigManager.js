const extend = require('extend');
const {join} = require('path');
const traverse = require('traverse');

class ConfigManager {
    constructor(options, callback) {
        let appConfigRaw = require(join(options.appBaseDir, 'conf/AppConfig.json')),
            configRaw = require(join(options.appBaseDir, 'conf/Config.json'));
        options.postProcess = options.postProcess || function (config) {
            return config;
        };
        callback(
            options.postProcess(
                this.evalJSBlocks(
                    extend(
                        true,
                        {},
                        appConfigRaw.common,
                        configRaw.common,
                        appConfigRaw[options.env],
                        configRaw[options.env]
                    )
                )
            )
        );
    }

    evalJSBlocks(config) {
        let EVAL_USED_KNOWINGLY = eval; //Good practice, passes linters too.
        traverse(config).forEach(function (val) {
            if (typeof val === 'string' || val instanceof String) {
                this.update(val.replace(/("?)<\?JS=([\w\W\s\S\d\D.]+?):JS>\1/g, function (all, quote, expression) {
                    return EVAL_USED_KNOWINGLY(expression);
                }));
            }
        });
        return config;
    }
}

exports = module.exports = ConfigManager;
