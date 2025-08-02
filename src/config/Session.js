
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
module.exports = function(app, secrets){

    const MONGODB_URI =
        'mongodb://localhost:27017';

    const store = new MongoDBStore({
      uri: MONGODB_URI,
      collection: 'lomaindnd-db'
    });

    

    app.use(
        session({
        secret: secrets,
        resave: false,
        saveUninitialized: false,
        store: store
        })
    );


    mongoose.connect(MONGODB_URI, {useNewUrlParser: true})

}