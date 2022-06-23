const MongoClient = require('../mongoexpress/node_modules/mongodb/mongodb').MongoClient;

async function connect(mongoUri, dbName){
    const client = await MongoClient.connect(mongoUri, {
        'useUnifiedTopology': true //there were different version of Mongo; when this is true, we don't have to care about those version
    });

    const db = client.db(dbName);
    return db;
}

//export out connect so that other js file can use
module.exports = {
    'connect': connect
}