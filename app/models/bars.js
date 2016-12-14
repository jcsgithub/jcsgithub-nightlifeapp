'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Bar = new Schema({
    attendees: Array,
    barId: String
});

module.exports = mongoose.model('Bar', Bar);
