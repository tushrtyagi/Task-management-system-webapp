/**
 * Responsible to define the mongo connections
 * */

class MongoConnections {

    /**
     * For storing the UI builder information
     * */
    static get APP_DB() {
        return "APP";
    }

    /**
     * For storing the cluster jobs Mutex
     * */
    static get AGENDA_DB() {
        return "AgendaDB";
    }

}

exports = module.exports = MongoConnections;
