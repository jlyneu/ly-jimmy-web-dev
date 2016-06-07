var mongoose = require("mongoose");

module.exports = function() {

    //var WebsiteSchema = require("../website/website.schema.server.js")();
    var WidgetSchema  = require("../widget/widget.schema.server.js")();

    var PageSchema = mongoose.Schema({
    //    _website: WebsiteSchema,
        name: String,
        description: String,
        widgets: [WidgetSchema],
        dateCreated: {
            type: Date,
            default: Date.now
        }
    });

    return PageSchema;
};