var mongoose = require("mongoose");

module.exports = function() {

    var PageSchema = require("../page/page.schema.server.js")();

    var WidgetSchema = mongoose.Schema({
        _page: PageSchema,
        type: {
            type: String,
            enum: ["HEADING", "IMAGE", "YOUTUBE", "HTML", "INPUT"]
        },
        name: String,
        text: String,
        placeholder: String,
        description: String,
        url: String,
        width: Number,
        height: Number,
        rows: Number,
        size: Number,
        class: String,
        icon: String,
        deletable: Boolean,
        formatted: Boolean,
        dateCreated: {
            type: Date,
            default: Date.now
        }
    });

    return WidgetSchema;
};