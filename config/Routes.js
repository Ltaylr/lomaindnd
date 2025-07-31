const homeRoutes = require('../routes/HomeRoutes');
const charRoutes = require('../routes/CharacterRoutes');
const campaignRoutes = require('../routes/CampaignRoutes');
const adminRoutes = require('../routes/admin');
const authRoutes = require('../routes/auth');

module.exports = function (app){
    app.use(homeRoutes);
    app.use(charRoutes);
    app.use(campaignRoutes);
    app.use('/admin', adminRoutes);
    app.use('/auth',authRoutes);
}