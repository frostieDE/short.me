var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET users listing. */
router.get('/:short', function(req, res, next) {
    var short = req.params.short;

    models.Url.find({where: { short: short}}).then(function(url) {
        if(url == null) {
            res.status(404).render('error', {
                config: require('config'),
                heading: req.i18n.__('notFound'),
                message: req.i18n.__('pageNotFound')
            });
        } else {
            models.sequelize.query("UPDATE " + models.Url.getTableName() + " SET clicks = clicks + 1").then(function() {
                res.redirect(url.url);
            });
        }
    });
});

module.exports = router;
