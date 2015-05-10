var express = require('express');
var router = express.Router();
var models = require('../models');
var crypto = require('crypto');
var config = require('config');
var urlTools = require('url');

/** Add a URL **/
router.post('/add', function(req, res, next) {
    var url = req.body.url;

    console.log(url);

    if(typeof(url) === "undefined" || url.length == 0) {
        res.status(400).json({
            error: req.i18n.__('urlNotSpecified'),
            code: 400
        });
    } else {
        if(url.substr(0, 7) != 'http://' && url.substr(0, 8) != 'https://') {
            url = 'http://' + url;
        }

        models.Url.find({where: { url: url }}).then(function(urlObj) {
            if(urlObj == null) {
                generateRandomHash(function(token) {
                    models.Url.create({
                        url: url,
                        short: token,
                        ip: getIpFromRequest(req)
                    }).then(function() {
                        res.json({
                            url: url,
                            short: urlTools.resolve(config.get('url'), '/u/' + token),
                            clicks: 0
                        });
                    }).catch(function(e) {
                        if(e.name == 'SequelizeValidationError' && e.errors.length > 0 && e.errors[0].path == 'url') {
                            res.status(400).json({
                                error: req.i18n.__('wrongUrlFormat'),
                                code: 400
                            });
                        } else {
                            res.status(500).json({
                                error: req.i18n.__('serverError'),
                                code: 500
                            });
                        }
                    })
                });
            } else {
                res.json({
                    url: url,
                    short: urlTools.resolve(config.get('url'), '/u/' + urlObj.short),
                    clicks: urlObj.clicks
                });
            }
        });
    }
});

function generateRandomHash(onSuccess) {
    crypto.randomBytes(32, function(ex, buffer) {
        var token = buffer.toString('hex').substr(0,6);

        models.Url.count({ where: ["short = ?", token]}).then(function(count) {
            if(count == 0) {
                onSuccess(token);
            } else {
                generateRandomHash(onSuccess);
            }
        });
    });
}

function getIpFromRequest(request) {
    return request.header("x-forwarded-for") || request.connection.remoteAddress;
}

module.exports = router;
