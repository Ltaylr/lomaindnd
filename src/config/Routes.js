const homeRoutes = require('../routes/HomeRoutes');
const charRoutes = require('../routes/CharacterRoutes');
const campaignRoutes = require('../routes/CampaignRoutes');
const adminRoutes = require('../routes/admin');
const authRoutes = require('../routes/auth');

module.exports = function (app){
    app.use((req, res, next) => {
        //console.log("erere");
        console.log(req.path);
        res.locals.isAuthenticated = req.session.isLoggedIn;
        res.locals.csrfToken = req.csrfToken();
        console.log("CSRF:" + res.locals.csrfToken);
        console.log(req.method);
        return next();
    });
    app.use('/admin', authRoutes);
    app.use(homeRoutes);
    app.use(charRoutes);
    app.use(campaignRoutes);
    app.use('/admin', adminRoutes);
    
}