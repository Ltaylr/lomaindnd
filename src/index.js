const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const secrets = ['mcnvhf5768kg;hvpe9gp92h4wef;sdnv'];
const flash = require('connect-flash');
const PORT = 8080;

app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  //console.log(req.body);
  next();
})
app.use(flash());

require('./config/Files')(app);
require('./config/Session')(app, secrets);
require('./config/Security')(app, secrets[0]);
app.use((req, res, next)=>{
  console.log("here");
  next();
})
require('./config/Routes')(app);

app.use((req, res, next) => {
    res.status(500).render('500', {
      docTitle: 'Page Not Found',
      path: '/500'
    });
  })
 
 
  
try{

  app.listen(PORT);

}
catch(err)
{
  console.log(err);
}
    
