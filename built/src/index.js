"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const configEnv = require('./config/configEnv.json');
const app = express();
console.log(configEnv);
const secrets = configEnv.secrets;
const flash = require('connect-flash');
const PORT = 8080;
app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
require('./config/Files')(app);
require('./config/Session')(app, configEnv);
require('./config/Security')(app, secrets[0]);
require('./config/Routes')(app);
app.use((req, res, next) => {
    res.status(500).render('500', {
        docTitle: 'Page Not Found',
        path: '/500'
    });
});
try {
    app.listen(PORT);
}
catch (err) {
    console.log(err);
}
//here is a comment again agians AGAIN - 2 3 4 5
//# sourceMappingURL=index.js.map