'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Bar = new Schema({
    name: String,
    url: String,
    image_url: String,
    review: String,
    attending: Array
});

module.exports = mongoose.model('Bar', Bar);
