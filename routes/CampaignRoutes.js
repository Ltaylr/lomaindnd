const express = require('express');
const router = express.Router();

router.get('/campaigns', (req, res, next) => {
    res.render('campaigns', {docTitle: 'Campaigns'});
});

module.exports = router;