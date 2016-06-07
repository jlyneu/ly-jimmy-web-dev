module.exports = function() {

    var mongoose = require("mongoose");

    var WebsiteSchema = require("../website/website.schema.server.js")();

    var UserSchema = mongoose.Schema({
        username: {
            type: String,
            unique: true
        },
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        websites: [WebsiteSchema],
        dateCreated: {
            type: Date,
            default: Date.now
        },
        dateUpdated: Date
    }, { collection: "assignment.user" });

    return UserSchema;
};