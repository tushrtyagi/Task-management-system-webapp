const {buildSchema} = require('graphql');
const {readFileSync} = require('fs');
const {join} = require('path');
/**
 * The schema for graph ql nodes
 * */
exports = module.exports = class GraphSchema {

    get types() {
        // Write the GraphQL lang Schema here. Can break in files if required aswell.
        return readFileSync(join(__dirname, 'schema.graphql')).toString();
    }

    compile() {
        return buildSchema(this.types);
    }

    static get schema() {
        if (!GraphSchema._compiledSchema) GraphSchema._compiledSchema = new GraphSchema().compile();
        return GraphSchema._compiledSchema;
    }
};
