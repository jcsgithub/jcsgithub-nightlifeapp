'use strict';

var Users = require('../models/users.js');

function UserHandler () {
    this.updateBars = function (req, res, next) {
        var data = req.body;
            
        Users
            .findOneAndUpdate({ '_id': data.userId }, { bars: data.newUserBars })
            .exec(function (err, result) {
                if (err) { throw err; }
        
                return next();
            }
        );
    };
}

module.exports = UserHandler;