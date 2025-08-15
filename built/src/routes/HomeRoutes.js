"use strict";
const express = require('express');
const router = express.Router();
router.get("/", (req, res, next) => {
    res.render('index', { docTitle: 'Lo Main Dnd' });
});
module.exports = router;
//# sourceMappingURL=HomeRoutes.js.map