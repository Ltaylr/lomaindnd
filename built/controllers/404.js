"use strict";
exports.notFound = (req, res, next, path = '') => {
    res.status(404).render('404', { docTitle: 'Page Not Found', path: '/' });
};
//# sourceMappingURL=404.js.map