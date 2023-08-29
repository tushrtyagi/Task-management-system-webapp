const Connection = require('./Connection');
const ObjectId = require("mongoose").Types.ObjectId;
const MongoConnections = require('../../../conf/MongoConnections');

class MongoDbModel extends MongoConnections {

    static initialize(name, mongoUrl) {
        return new Promise((res, rej) => {
            if (!mongoUrl) throw new Error('MongoDb Url is required to initialize Mongo model. ' + name);
            new Connection(name, mongoUrl, (err, db, mongoose) => {
                if (err) return rej(err);

                // Ensure interface implemented
                if (!this.Name) throw new Error('Please implement Name in Model class');
                if (!this.Schema) throw new Error('Please implement Schema in Model class');
                if (!this.Indexes) throw new Error('Please implement Indexes in Model class');

                // Define Schema
                let schema = mongoose.Schema(this.Schema(mongoose));

                if (this.PreHook) {
                    let kinds = Object.keys(this.PreHook);
                    kinds.map(kind => schema.pre(kind, this.PreHook[kind]));
                  }

                // Add in member functions
                let instance = new this();
                Object.getOwnPropertyNames(Object.getPrototypeOf(instance)).forEach(memberFn => {
                    if (['length', 'name', 'prototype', 'Name', 'Schema', 'Indexes', 'initialize', 'constructor'].indexOf(memberFn) < 0) {
                        schema.methods[memberFn] = Object.getPrototypeOf(instance)[memberFn];
                    }
                });

                // Add in static functions
                Object.getOwnPropertyNames(this).forEach(staticFn => {
                    if (['length', 'name', 'prototype', 'Name', 'Schema', 'Indexes', 'initialize'].indexOf(staticFn) < 0) {
                        schema.statics[staticFn] = this[staticFn];
                    }
                });
                schema.statics.convertToObjectId = MongoDbModel.convertToObjectId;

                // Build Model
                let model = db.model(this.Name, schema, this.collectionName);

                //Index
                (this.Indexes || []).forEach(index => {
                    schema.index(index);
                });
                model.ensureIndexes();

                res(model);
            });
        });
    }

    static convertToObjectId(id) {
        let objectId = null;
        if (id instanceof ObjectId) {
            objectId = id;
        } else if (id) {
            try {
                objectId = ObjectId(id);
            } catch (c) {
                objectId = null;
            }
        }
        return objectId;
    }
}

exports = module.exports = MongoDbModel;
