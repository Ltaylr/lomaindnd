const charController = require('../controllers/CharactersController');
const express = require('express');
const router = express.Router();

router.get('/characters', charController.getCharacterLevelOptions);

router.get('/characters/:level', charController.getCharacterSheets);

router.get('/characters/:level/:char', charController.getCharacterSheet);

module.exports = router;