var Sequelize = require('sequelize');
var config    = require('config').database;

var options = {
    dialect: config.get('driver')
};

if(config.get('driver') == 'sqlite3') {
    options.path = path.combine(__dirname + '/' + config.get('connection.path'));
}

var sequelize = new Sequelize(
    config.get('connection.database'),
    config.get('connection.username'),
    config.get('connection.password')
, options);

module.exports["Url"] = sequelize.import(__dirname + '/Url.js');

module.exports.sequelize = sequelize;