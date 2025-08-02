const fs = require('fs');
const topPath = require('../util/path');
const path = require('path');

exports.getCharacterLevelOptions = (req, res, next) => {
    const levelFolders = fs.readdirSync(path.join(topPath, 'files', 'characters'));
    res.render('characters', {docTitle: 'Characters', levels: levelFolders});
}

exports.getCharacterSheets = (req, res, next) => {
    const level = req.params.level;
    fs.readdir(path.join(topPath, 'files', 'characters', level),(err, chars) =>{
        res.render('levels', {docTitle: level, characters: chars, level: level});
    });
}

exports.getCharacterSheet = (req, res, next) => {
    const level = req.params.level;
    const char = req.params.char;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Dispostion', 'attachment; filename="' + char +'"');
    res.download(path.join(topPath, 'files', 'characters', level, char));
}