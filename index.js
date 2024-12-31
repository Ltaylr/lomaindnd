const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const helmet = require('helmet');

app.use(helmet());//set standard security http headers

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(__dirname + '/public'));

let characters = [];

const homeRoutes = require('./routes/HomeRoutes');
const charRoutes = require('./routes/CharacterRoutes');
const campaignRoutes = require('./routes/CampaignRoutes');

app.use(homeRoutes);
app.use(charRoutes);
app.use(campaignRoutes);

app.use((req, res, next) => {
    res.status(500).render('500', {
      docTitle: 'Page Not Found',
      path: '/500'
    });
  })

app.use(express.static(path.join(__dirname, 'files', 'characters')));

const PORT = 8080;


app.listen(PORT, '127.0.0.1', () => {
    console.log('server running on port 8080...')
})
