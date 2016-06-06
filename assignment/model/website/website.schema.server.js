var mongoose = require("mongoose");

module.exports = function() {

    var UserSchema = require("../user/user.schema.server.js")();
    var PageSchema = require("../page/page.schema.server.js")();

    var WebsiteSchema = mongoose.Schema({
        _user: UserSchema,
        name: String,
        description: String,
        pages: [PageSchema],
        dateCreated: {
            type: Date,
            default: Date.now
        }
    });

    return WebsiteSchema;
};