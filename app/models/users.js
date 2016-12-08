'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    bars: Array,
    facebook: {
    	id: String,
    	displayName: String
    },
    lastSearch: String
});

module.exports = mongoose.model('User', User);
