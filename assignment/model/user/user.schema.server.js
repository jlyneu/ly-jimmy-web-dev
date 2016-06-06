var mongoose = require("mongoose");

module.exports = function() {

    var WebsiteSchema = require("../website/website.schema.server.js")();

    var UserSchema = mongoose.Schema({
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        websites: [WebsiteSchema],
        dateCreated: {
            type: Date,
            default: Date.now
        }
    });

    return UserSchema;
};