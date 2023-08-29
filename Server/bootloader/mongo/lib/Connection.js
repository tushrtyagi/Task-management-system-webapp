/**
 * Manages the connection
 * */

const mongoose = require('mongoose');
// const DataTable = require('mongoose-datatable').default;
// DataTable.configure({ debug: true, verbose: true });
// mongoose.plugin(DataTable.init);



class Connection {

    constructor(name, mongoUrl, callback) {
        Connection._connections = Connection._connections || {};
        this.mongoUrl = mongoUrl;
        this.name = name;

        this.connect(callback);
    }

    connect(callback) {
        if (!this.mongoUrl) throw new Error('Can not connect without a mongo url!');
        if (Connection._connections[this.mongoUrl]) return callback(null, Connection._connections[this.mongoUrl], mongoose);
        // Connect and cache connection
        const db = mongoose.createConnection(this.mongoUrl, {useUnifiedTopology: true, useNewUrlParser: true});
        db.on('error', callback);
        db.once('open', () => {
            log.info('Connected to Mongodb!', this.name);
            Connection._connections[this.mongoUrl] = db;
            callback(null, Connection._connections[this.mongoUrl], mongoose);
        });
    }
}

exports = module.exports = Connection;
