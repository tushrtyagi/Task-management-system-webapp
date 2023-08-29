/**
 * Error for issues in Flatten Job
 * */

exports = module.exports = class CohortFlattenJobError extends Error {

    constructor(errorMessage, cohortObject) {
        super();
        this.message = `${errorMessage} | CohortInfo: ${JSON.stringify(cohortObject)}`;
        this.name = 'CohortFlattenJobError';
        this.origMessage = errorMessage;
    }

};
