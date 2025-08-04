"use strict";
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
let _db;
const mongoConnect = (callback) => {
    MongoClient
        .connect('localhost:27017')
        .then(client => {
        console.log("here");
        console.log('Connected to MongoDb instance');
        _db = client.db();
        console.log(_db);
        callback(client);
    })
        .catch(err => {
        console.log(err);
        throw err;
    });
};
const getDb = () => {
    console.log(_db);
    if (_db) {
        return _db;
    }
    throw 'No Database Found';
};
module.exports.mongoConnect = mongoConnect;
module.exports.getDb = getDb;
//# sourceMappingURL=database.js.map