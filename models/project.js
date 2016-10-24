var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Project = new Schema({
    heading: String,
    summary: String,
    link: String,
    date: { type: Date, default: Date.now() },
    content: String,
    photos: Array
});

module.exports = mongoose.model('Project', Project);
