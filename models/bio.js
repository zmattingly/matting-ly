var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Bio = new Schema({
    heading: String,
    content: String,
});

module.exports = mongoose.model('Bio', Bio);

