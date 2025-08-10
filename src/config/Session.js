
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');

module.exports = function(app, configEnv){

    const MONGODB_URI =
        configEnv.dbConnectionString;

    const store = new MongoDBStore({
      uri: MONGODB_URI,
      collection: 'lomaindnd-db'
    });

    

    app.use(
        session({
        secret: configEnv.secrets,
        resave: false,
        saveUninitialized: false,
        store: store
        })
    );


    mongoose.connect(MONGODB_URI, {useNewUrlParser: true})
    
}