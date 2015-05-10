"use strict";

module.exports = function(sequelize, DataTypes) {
    var Url = sequelize.define("Url", {
        url: {
            type: DataTypes.TEXT,
            validate: {
                isUrl: true
            }
        },
        short: {
            type: DataTypes.STRING,
            validate: {
                is: ["^[a-z0-9]+$", "i"]
            },
            unique: true
        },
        clicks: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0
        },
        ip: {
            type: DataTypes.STRING/*,
            validate: {
                isIP: true
            }*/
        }
    }, {
        timestamps: true,
        updatedAt: false
    });

    return Url;
};