/**
 * Constants
 * */

class Constants {

    static get MAPPER_HELP_STR() {
        return `MAPPER: Used to post process response of graph query. Variable 'data' is the data response. variable 'parent' is the root response. Add props in 'parent' to populate at root level. Add props to 'data' to enhance data. If returning, make sure to return object with keys {parent, data}.`;
    }

    static get MAX_LIMIT() {
        return 100;
    }

}

exports = module.exports = Constants;
