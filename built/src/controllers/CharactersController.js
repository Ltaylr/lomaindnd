"use strict";
const fs = require('fs');
const topPath = require('../util/path');
const path = require('path');
const Character = require("../models/Character");
exports.getCharacters = async (req, res, next) => {
    Character.find({})
        .then(characters => {
        res.render('characters', {
            characters: characters,
            docTitle: 'Characters',
            path: '/characters',
            //csrfToken: req.csrfToken(),
        });
    })
        .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};
exports.getCharacter = (req, res, next) => {
    const campId = req.params.characterId;
    Character.findById(campId)
        .then(character => {
        res.render('character', {
            character: character,
            docTitle: character.title,
            path: '/character',
            isAuthenticated: req.session.isLoggedIn,
            csrfToken: req.csrfToken()
        });
    })
        .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};
exports.getCharacterLevelOptions = (req, res, next) => {
    const levelFolders = fs.readdirSync(path.join(topPath, 'files', 'characters'));
    res.render('characters', { docTitle: 'Characters', levels: levelFolders });
};
exports.getCharacterSheets = (req, res, next) => {
    const level = req.params.level;
    fs.readdir(path.join(topPath, 'files', 'characters', level), (err, chars) => {
        res.render('levels', { docTitle: level, characters: chars, level: level });
    });
};
exports.getCharacterSheet = (req, res, next) => {
    const level = req.params.level;
    const char = req.params.char;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Dispostion', 'attachment; filename="' + char + '"');
    res.download(path.join(topPath, 'files', 'characters', level, char));
};
//# sourceMappingURL=CharactersController.js.map