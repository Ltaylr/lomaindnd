const homeRoutes = require('../routes/HomeRoutes');
const charRoutes = require('../routes/CharacterRoutes');
const campaignRoutes = require('../routes/CampaignRoutes');
const adminRoutes = require('../routes/admin');
const authRoutes = require('../routes/auth');

module.exports = function (app){
    app.use((req, res, next) => {
        console.log("erere");
        console.log(req);
        res.locals.isAuthenticated = req.session.isLoggedIn;
        res.locals.csrfToken = req.csrfToken();
        return next();
    });
    app.use('/admin', authRoutes);
    app.use(homeRoutes);
    app.use(charRoutes);
    app.use(campaignRoutes);
    app.use('/admin', adminRoutes);
    
}