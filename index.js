const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(__dirname + '/public'));

let characters = [];

const levelFolders = fs.readdirSync('./files/characters');



app.get("/", (req, res, next) => {
    res.render('index', { docTitle: 'Lo Main Dnd'});
})

app.get('/characters', (req, res, next) => {
    res.render('characters', {docTitle: 'Characters', levels: levelFolders});
});

app.get('/characters/:level', (req, res, next) =>{
    const level = req.params.level;
    fs.readdir(path.join('./files/characters', level),(err, chars) =>{
        res.render('levels', {docTitle: level, characters: chars});
    });

    
})

app.get('/campaign', (req, res, next) => {
    res.render('campaign', {docTitle: 'Campaign'});
});

app.get('/schedule', (req, res, next) => {
    res.render('schedule', {docTitle: 'Schedule'});
});

app.get('/about', (req, res, next) => {
    res.render('about', {docTitle: 'About'});
});

const PORT = 8080;


app.listen(PORT, '127.0.0.1', () => {
    console.log('server running on port 8080...')
})
