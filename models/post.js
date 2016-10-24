var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Post = new Schema({
    title: String,
    author: String,
    heading: String,
    date: { type: Date, default: Date.now() },
    content: String,
    published: { type: Boolean, default: false }
});

module.exports = mongoose.model('Post', Post);